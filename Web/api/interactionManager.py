import Model
from Data.storage import StorageFactory
from Processor import TriggerProcessor
from ActionRunner import ActionRunner
from threading import RLock
import datetime


class InteractionManager(object):

    def __init__(self, interactionId):
        self._interactionId = interactionId
        ds = StorageFactory.getNewSession()
        interaction = ds.query(Model.Interaction).get(interactionId)
        triggers = self._getTriggers(ds, interaction.robot, interaction.user)
        self._triggerProcessor = TriggerProcessor(triggers, interaction.robot, datetime.timedelta(seconds=0.01))
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
            iLog = ds.query(Model.InteractionLog).get(logId)
            iLog.finished = datetime.datetime.utcnow()
        log = Model.DebugLog()
        log.data = ''
        for timestamp, msg in handle.output:
            log.data += '%s: %s\n' % (timestamp.isoformat(), msg)
        ds.add(log)
        if iLog:
            iLog.logs.append(log)
        ds.commit()
        with self._handleLock:
            self._handles.pop(handle.actionId, None)

    def _getTriggers(self, ds, user, robot):
        #TODO: This needs to filter by triggers that the robot supports (sensors, and user overrides)
        return ds.query(Model.Trigger).all()

    def _triggerActivated(self, source, triggerActivatedArg):
        self.doTrigger(triggerActivatedArg.trigger_id, triggerActivatedArg.value)

    def doTrigger(self, trigger_id, value):
        ds = StorageFactory.getNewSession()
        log = Model.InteractionLog()
        log.interaction_id = self._interactionId
        log.trigger_id = trigger_id
        log.trigger_value = value
        ds.add(log)
        ds.commit()
        action = ds.query(Model.Action).join(Model.Trigger).filter(Model.Trigger.id == trigger_id).first()
        if action:
            with self._handleLock:
                if action.id in self._handles:
                    self._handles[action.id].stop()
                self._handles[action.id] = self._actionRunner.executeAsync(action, self._handleComplete, (log.id,))
        return log
