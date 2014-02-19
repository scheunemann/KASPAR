import cherrypy
import datetime
from threading import RLock
from crud import ModelCRUD
import Data.Model
import Model.model
from controller import Helper
from Data.storage import StorageFactory
from Processor import TriggerProcessor
from ActionRunner import ActionRunner

interactionManagers = {}

class UserAction(object):
    exposed = True

    def __init__(self):
        pass

    @cherrypy.tools.json_out()
    def GET(self, actionId, interactionId, timestamp=None):

        active = interactionId in interactionManagers and actionId in interactionManagers[interactionId].activeActions

        if timestamp != None:
            pass
        else:
            pass

        ret = {
               'id': actionId,
               'output': "Not implemented",
               'active': active,
               'timestamp': Helper._utcDateTime(datetime.datetime.now()),
               }

        return ret

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, buttonId, interactionId):
        if interactionId not in interactionManagers:
            raise cherrypy.NotFound()
        
        exists = cherrypy.request.db.query(Data.Model.Trigger).filter(Data.Model.Trigger.id==buttonId).count() > 0
        if not exists:
            raise cherrypy.NotFound()

        interactionManagers[interactionId].triggerActivated(buttonId, 1)

        ret = {
               'button_id': buttonId,
               'interaction_id': interactionId,
               'timestamp': Helper._utcDateTime(datetime.datetime.now()),
        }

        return ret


class Interaction(ModelCRUD):
    exposed = True
    useraction = UserAction()
    
    def __init__(self):
        super(Interaction, self).__init__(Model.model.Interaction, ['GET', 'POST'])
        
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None, **constraint):
        interaction, resolveList = self._save(oid, **constraint)

        if interaction and interaction.startTime and not interaction.endTime:
            interactionManagers[interaction.id] = InteractionManager(interaction)
            interactionManagers[interaction.id].start()
        elif interaction and interaction.endTime:
            if interaction.id in interactionManagers: 
                interactionManagers[interaction.id].stop()
            
        return interaction.serialize(urlResolver=self._urlResolver, resolveProps=resolveList)

class InteractionManager(object):
        
    def __init__(self, interaction):
        self._interactionId = interaction.id
        triggers = self._getTriggers(interaction.robot, interaction.user)
        self._triggerProcessor = TriggerProcessor(triggers, datetime.timedelta(seconds=0.01))
        self._triggerProcessor.triggerActivated += self.triggerActivated
        self._actionRunner = ActionRunner(interaction.robot)
        self._handles = {}
        self._handleLock = RLock()
        
    def start(self):
        self._triggerProcessor.start()
    
    def stop(self):
        self._triggerProcessor.stop()
        
    @property
    def activeActions(self):
        with self._handleLock:
            return self._handles.keys()
        
    def stopAction(self, actionId):
        with self._handleLock:
            if actionId in self._handles:
                self._handles[actionId].stop()
        
    def _handleComplete(self, handle):
        ds = StorageFactory.getNewSession()
        log = Model.DebugLog()
        log.data = "/n".join(handle.output)
        ds.add(log)
        ds.commit()
        with self._handleLock:
            self._handles.pop(handle.actionId, None)

    def triggerActivated(self, trigger_id, value):
        ds = StorageFactory.getNewSession()
        log = Model.InteractionLog()
        log.interaction_id = self._interactionId
        log.trigger_id = trigger_id
        ds.add(log)
        ds.commit()
        action = ds.query(Data.Model.Action).join(Data.Model.Trigger).filter(Data.Model.Trigger.id==trigger_id).first()
        with self._handleLock:
            if action.id in self._handles:
                self._handles[action.id].stop()
            self._handles[action.id] = self._actionRunner.executeAsync(action, self._handleComplete)
