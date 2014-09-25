import kasparGUI.Model as Model
from robotActionController.Data.storage import StorageFactory
from robotActionController.Processor import TriggerProcessor
from robotActionController.ActionRunner import ActionRunner
from robotActionController.Robot import Robot
from threading import RLock
import datetime


class InteractionManager(object):
    def __init__(self, interactionId):
        self._interactionId = interactionId
        ds = StorageFactory.getNewSession()
        interaction = ds.query(Model.Interaction).get(interactionId)
        if interaction.robot:
            robot = Robot.getRunnableRobot(interaction.robot)
        else:
            robot = ds.query(Model.Robot).join(Model.Setting, Model.Robot.name==Model.Setting.value).filter(Model.Setting.key=='robot').first()
            interaction.robot = robot
            ds.commit()
        self._triggerProcessor = TriggerProcessor([], robot, datetime.timedelta(seconds=0.01))
        self._triggerProcessor.triggerActivated += self._triggerActivated
        self._actionRunner = ActionRunner(robot)
        self._handles = {}
        self._handleLock = RLock()

    def start(self):
        self._triggerProcessor.start()

    def stop(self):
        self._triggerProcessor.stop()

    def setTriggers(self, triggers):
        self._triggerProcessor.setTriggers(triggers)

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
            self._handles.pop(handle.action.id, None)

    def _getTriggers(self, ds, user, robot):
        # TODO: This needs to filter by triggers that the robot supports (sensors, and user overrides)
        return ds.query(Model.Trigger).all()

    def _triggerActivated(self, source, triggerActivatedArg):
        self.doTrigger(triggerActivatedArg.trigger_id, triggerActivatedArg.value, triggerActivatedArg.action)

    def doTrigger(self, triggerId, value, action=None):
        ds = StorageFactory.getNewSession()
        log = Model.InteractionLog()
        log.interaction_id = self._interactionId
        log.trigger_id = triggerId
        log.trigger_value = value
        ds.add(log)
        ds.commit()
        if action == None:
            action = ds.query(Model.Action).join(Model.Trigger).filter(Model.Trigger.id == triggerId).first()

        if action:
            action = ActionRunner.getRunable(action)
            with self._handleLock:
                if action.id in self._handles:
                    self._handles[action.id].stop()
                self._handles[action.id] = self._actionRunner.executeAsync(action, self._handleComplete, (log.id,))
        return log
