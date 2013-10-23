import sys
from robot import ROSRobot

class Factory(object):

    @staticmethod
    def getRobotInterface(robot):
        print "Building class for robot named: %s" % robot.name
        robotInt = None
        try:
            robotClass = __import__(robot.type.extraData['className'], globals(), locals())
            if issubclass(robotClass, ROSRobot):
                robotInt = robotClass(robot.name, robot.type.extraData['rosMaster'])
            else:
                robotInt = robotClass(robot.name, **robot.extraData)
        except:
            print >> sys.stderr, "Unknown robot type %s" % robot.type.name
            return None

        print "Finished building class %s" % robotInt.__class__.__name__
        return robotInt
