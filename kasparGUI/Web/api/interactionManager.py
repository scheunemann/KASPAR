import kasparGUI.Model as Model
from robotActionController.Data.storage import StorageFactory
from robotActionController.Processor import TriggerProcessor
from robotActionController.ActionRunner import ActionManager
from robotActionController.Robot import Robot
import datetime
import logging
from gevent import spawn
from gevent.pool import Group
from gevent.lock import RLock


class InteractionManager(object):
    def __init__(self, interactionId):
        self._interactionId = interactionId
        self._logger = logging.getLogger(self.__class__.__name__)
        ds = StorageFactory.getNewSession()
        interaction = ds.query(Model.Interaction).get(interactionId)
        if not interaction.robot:
            robot = ds.query(Model.Robot).join(Model.Setting, Model.Robot.name==Model.Setting.value).filter(Model.Setting.key=='robot').first()
            interaction.robot = robot
            ds.commit()

        robot = Robot.getRunableRobot(interaction.robot)
        self._triggerProcessor = TriggerProcessor([], robot, datetime.timedelta(seconds=0.01))
        self._triggerProcessor.triggerActivated += self._triggerActivated
        self._actionManager = ActionManager.getManager(robot)
        self._handles = {}
        self._handleLock = RLock()

    def start(self):
        self._triggerProcessor.start()

    def stop(self):
        self._triggerProcessor.stop()

    def setTriggers(self, triggers):
        self._logger.debug("Settings triggers to: %s", triggers)
        self._actionManager.clearCache()
        self._actionManager.cacheActions([t.action for t in triggers])
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
            self._logger.debug(log.data.strip())
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
        source = 'USER' if triggerActivatedArg.type == 'ButtonTrigger' else 'AUTOMATIC'
        self.doTrigger(triggerActivatedArg.trigger_id, triggerActivatedArg.value, source, triggerActivatedArg.action)

    def doTrigger(self, triggerId, value, source, action=None):
        ds = StorageFactory.getNewSession()
        log = Model.InteractionLog()
        log.source = source
        log.interaction_id = self._interactionId
        log.trigger_id = triggerId
        log.trigger_value = value
        ds.add(log)
        ds.commit()
        if action == None:
            action = ds.query(Model.Action).join(Model.Trigger).filter(Model.Trigger.id == triggerId).first()

        if action:
            action = self._actionManager.getRunable(action)
            if self._handles:
                with self._handleLock:
                    handles = Group()
                    for handle in self._handles.values():
                        handles.add(spawn(handle.stop))
                handles.join()

            handler = self._actionManager.executeActionAsync(action, self._handleComplete, (log.id,))

            with self._handleLock:
                self._handles[action.id] = handler
        return log
