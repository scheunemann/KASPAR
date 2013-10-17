import logging, time
from Data.Model.Action import Sequence, Group, Sound, Pose
from multiprocessing.pool import ThreadPool
from Robot.servoInteface.servoInterface import ServoInterface
from pygame.mixer import Sound as pySound #apt-get install python-pygame (will be added when support beyone WAV is needed)

class Runner(object):
    
    def __init__(self, robot):
        self._robot = robot;
        self._logger = logging.getLogger(__name__)
        
    @staticmethod
    def isValid(action):
        return action != None
    
    def execute(self, action):
        pass

class ActionRunner(Runner):

    def __init__(self, robot):
        super(ActionRunner, self).__init__(robot)

    def execute(self, action):
        self._getRunner(action).execute(action)

    def isValid(self, action):
        return self._getRunner(action).isValid(action)
    
    def _getRunner(self, action):
        if type(action) == Sequence:
            return SequenceRunner(self._robot)
        elif type(action) == Pose:
            return PoseRunner(self._robot)
        elif type(action) == Sound:
            return SoundRunner(self._robot)
        elif type(action) == Group:
            return GroupRunner(self._robot)
        else:
            self._logger.critical("Could not determine action type for %s" % (action))

class GroupRunner(Runner):
    
    def __init__(self, robot):
        super(GroupRunner, self).__init__(robot)
        self._threadPool = ThreadPool()

    def isValid(self, group):
        valid = True
        for action in group.actions:
            valid = valid & ActionRunner(self.robot).isValid(action)
            if not valid:
                break

    def execute(self, group):
        self._threadPool.map(lambda a: ActionRunner(self._robot).execute(a), group.actions)
        
class PoseRunner(object):
    
    def __init__(self, robot):
        super(PoseRunner, self).__init__(robot)

    def execute(self, pose):
        interfaces = {}
        for jointPosition in pose.jointPositions:
            servos = filter(lambda s: s.jointName == jointPosition.jointName, self._robot.servos)
            if len(servos) != 1:
                self._logger.critical("Could not determine appropriate servo on Robot(%s).  Expected 1 match, got %s", self._robot.name, len(servos))
                raise ValueError
                
            servoInterface = ServoInterface.getServoInterface(servos[0])
            servoInterface.setPosition(jointPosition.angle, jointPosition.speed)
            interfaces[jointPosition] = servoInterface
            
        for (jointPosition, interface) in interfaces:
            # TODO: better tolerance
            while abs(interface.getPosition() - jointPosition.angle) > 10 and interface.isMoving():
                time.sleep(0.001)

    def isValid(self, pose):
        if len(pose.jointPositions) > 0:
            for jointPosition in pose.jointPositions:
                if len(filter(lambda s: s.jointName == jointPosition.jointName, self._robot.servos)) == 0:
                    return False
            return True
        else:
            return False
    
class SequenceRunner(object):

    def __init__(self, robot):
        super(SequenceRunner, self).__init__(robot)
        
    def isValid(self, sequence):
        valid = True
        for action in sequence.actions:
            valid = valid & ActionRunner(self.robot).isValid(action)
            if not valid:
                break

    def execute(self, sequence):
        ar = ActionRunner(self._robot)
        for orderedAction in sorted(sequence.actions, key=lambda a: a.order):
            ar.execute(orderedAction.action)

class SoundRunner(object):
    
    def __init__(self, robot):
        self._robot = robot
        self._logger = logging.getLogger(__name__)
        
    def isValid(self, sound):
        return len(sound.data) > 0
        
    def execute(self, sound):
        s = pySound(sound.data)
        channel = s.play()
        while channel.get_busy():
            time.sleep(0.001)