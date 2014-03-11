import cherrypy
import datetime
from threading import RLock
from crud import ModelCRUD
import Data.Model
import Model
from controller import Helper
from Data.storage import StorageFactory
from Processor import TriggerProcessor
from ActionRunner import ActionRunner
from Model.log import InteractionLog

interactionManagers = {}


class UserAction(object):
    exposed = True

    def __init__(self):
        pass

    def _cp_dispatch(self, vpath):
        if vpath and len(vpath) > 1:
            cherrypy.request.params['interactionId'] = vpath.pop(0)
        if not vpath[0].isdigit():
            return getattr(self, vpath.pop(0), None)

    @cherrypy.tools.json_out()
    def GET(self, interactionId, logId=None, timestamp=None):
        if logId:
            logs = cherrypy.request.db.query(Model.InteractionLog).get(logId)
        else:
            logs = cherrypy.request.db.query(Model.InteractionLog).filter(Model.InteractionLog.interaction_id == interactionId)

        ret = []
        for log in logs:
            ret.append({
                           'id': log.id,
                           'button_id': log.trigger_id,
                           'interaction_id': log.interaction_id,
                           'timestamp': Helper._utcDateTime(log.timestamp),
                           'active': log.finished == None,
                        })

        return ret[0] if logId else ret

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, interactionId):
        if 'trigger_id' in cherrypy.request.json:
            triggerId = cherrypy.request.json['trigger_id']
        else:
            raise cherrypy.HTTPError("Invalid JSON, missing 'trigger_id'")

        if interactionId not in interactionManagers:
            raise cherrypy.HTTPError("Cannot update an inactive interaction.")

        exists = cherrypy.request.db.query(Data.Model.Trigger).filter(Data.Model.Trigger.id == triggerId).count() > 0
        if not exists:
            raise cherrypy.NotFound("Invalid trigger id: %s" % triggerId)

        log = interactionManagers[interactionId].doTrigger(triggerId)

        ret = {
               'id': log.id,
               'button_id': log.trigger_id,
               'interaction_id': log.interaction_id,
               'timestamp': Helper._utcDateTime(log.timestamp),
               'active': True
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
        self._triggerProcessor.triggerActivated += self._triggerActivated
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

    def _handleComplete(self, handle, logId=None):
        ds = StorageFactory.getNewSession()
        if logId:
            iLog = ds.query(InteractionLog).get(logId)
            iLog.finished = datetime.datetime.now()
        log = Model.DebugLog()
        log.data = "/n".join(handle.output)
        ds.add(log)
        if iLog:
            iLog.logs.append(log)
        ds.commit()
        with self._handleLock:
            self._handles.pop(handle.actionId, None)

    def _triggerActivated(self, trigger_id, value):
        self.doTrigger(trigger_id, value)

    def doTrigger(self, trigger_id, value):
        ds = StorageFactory.getNewSession()
        log = Model.InteractionLog()
        log.interaction_id = self._interactionId
        log.trigger_id = trigger_id
        log.trigger_value = value
        ds.add(log)
        ds.commit()
        action = ds.query(Data.Model.Action).join(Data.Model.Trigger).filter(Data.Model.Trigger.id == trigger_id).first()
        if action:
            with self._handleLock:
                if action.id in self._handles:
                    self._handles[action.id].stop()
                self._handles[action.id] = self._actionRunner.executeAsync(action, self._handleComplete, (log.id,))
        return log
