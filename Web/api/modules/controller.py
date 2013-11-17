import cherrypy
import datetime
from dateutil.tz import tzutc
import logging
import time

from Data.Model import Servo, Robot, Action
from Robot.ServoInteface import ServoInterface as ServoInterface_
from ActionRunner import ActionRunner


class Helper(object):
    _interfaces = {}

    @staticmethod
    def _fromUtcDateTime(dt):
        return datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S.%fZ")

    @staticmethod
    def _utcDateTime(dt):
        if dt.tzinfo:
            dt = dt.astimezone(tzutc()).replace(tzinfo=None)
        return dt.isoformat() + 'Z'

    @staticmethod
    def _getInterface(servoId):
        # if not Helper._interfaces.has_key(servoId):
        #    servo = Helper._getServo(servoId)
        #    if servo != None:
        #        Helper._interfaces[servoId] = ServoInterface_.getServoInterface(servo)
        #    else:
        #        Helper._interfaces[servoId] = None
        # return Helper._interfaces[servoId]
        return ServoInterface_.getServoInterface(Helper._getServo(servoId))

    @staticmethod
    def _getServo(servoId):
        servo = cherrypy.request.db.query(Servo).get(servoId)
        if servo == None:
            # self._logger.critical("Could not locate servo with id %s", servoId)
            return None
        else:
            return servo


class ActionTest(object):
    exposed = True
    _runners = {}

    def __init__(self):
        self.runners = {}

    @cherrypy.tools.json_out()
    def GET(self, actionId, timestamp=None):

        if actionId in ActionTest._runners:
            active = ActionTest._runners[actionId].isAlive()
            output = ActionTest._runners[actionId].output
        else:
            active = False
            output = []

        if timestamp != None:
            pass
        else:
            pass

        output.sort(key=lambda (ts, val): ts)

        ret = {
               'id': actionId,
               'output': output,
               'active': active,
               'timestamp': Helper._utcDateTime(datetime.datetime.now()),
               }

        return ret

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, actionId):
        #data = cherrypy.request.json

        if actionId in ActionTest._runners and ActionTest._runners[actionId].isAlive():
            handle = ActionTest._runners[actionId]
            handle.stop()
        else:
            action = cherrypy.request.db.query(Action).get(actionId)
            robot = cherrypy.request.db.query(Robot).get(1)
            handle = ActionRunner(robot).executeAsync(action)
            ActionTest._runners[actionId] = handle

        active = handle.isAlive()
        output = handle.output

        ret = {
               'id': actionId,
               'output': output,
               'active': active,
               'timestamp': Helper._utcDateTime(datetime.datetime.now()),
        }

        return ret


class RobotInterface(object):

    def __init__(self):
        self._interfaces = {}
        self._logger = logging.getLogger(__name__)
        self._lastPositions = {}

    @cherrypy.tools.json_out()
    def GET(self, robotId, timestamp=None):
        servos = self._getServos(robotId)
        if servos == None:
            raise cherrypy.NotFound()

        startTime = datetime.datetime.now()
        timeout = 5
        if timestamp != None:
            while servos['timestamp'] <= Helper._fromUtcDateTime(timestamp) and (datetime.datetime.now() - startTime).seconds < timeout:
                time.sleep(0.1)
                servos = self._getServos(robotId)

        ret = {
               'servos': map(
                             lambda (key, value): {
                                                 'id': key,
                                                 'position': value['position'],
                                                 'poseable': value['poseable'],
                                                 'jointName': value['jointName'],
                                                 }, servos['servos'].iteritems()),
               'timestamp': Helper._utcDateTime(servos['timestamp']),
               }

        return ret

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, robotId):
        data = cherrypy.request.json
        for servo in data['servos']:
            interface = Helper._getInterface(servo['id'])
            if interface == None:
                # TODO: Error handling
                continue
                # raise cherrypy.NotFound()
            else:
                try:
                    if servo['position'] != None:
                        interface.setPosition(int(servo['position']), 100)
                    if servo['poseable'] != None:
                        interface.setPositioning(bool(servo['poseable']))
                    return 'OK'
                except Exception:
                    # TODO: Error handling
                    continue
                    # raise cherrypy.HTTPError(message=e.message)

        ret = {
               'servos': map(
                             lambda servo: {
                                                 'id': servo['id'],
                                                 'position': servo['position'],
                                                 'poseable': servo['poseable'],
                                                 'jointName': servo['jointName'],
                                                 }, data['servos']),
               'timestamp': Helper._utcDateTime(datetime.datetime.now()),
               }

        return ret

    def _getServos(self, robotId):
        robot = cherrypy.request.db.query(Robot).get(robotId)
        if robot == None:
            self._logger.critical("Could not locate robot with id %s", robotId)
            return None
        else:
            if robotId not in self._lastPositions:
                self._lastPositions[robotId] = {'timestamp': None, 'servos': {}}

            for servo in robot.servos:
                if servo.id not in self._lastPositions[robotId]['servos']:
                    self._lastPositions[robotId]['servos'][servo.id] = {'position': None, 'poseable': None, 'timestamp': None}

                interface = Helper._getInterface(servo.id)
                if interface == None:
                    self._logger._logger.critical("Could not locate servo with id %s", servo.Id)
                    continue
                currentPos = interface.getPosition()
                if self._lastPositions[robotId]['servos'][servo.id]['position'] != currentPos:
                    self._lastPositions[robotId]['servos'][servo.id]['position'] = currentPos
                    self._lastPositions[robotId]['servos'][servo.id]['timestamp'] = datetime.datetime.now()

            self._lastPositions[robotId]['timestamp'] = max(self._lastPositions[robotId]['servos'].values(), key=lambda x: x['timestamp'])['timestamp']

        return self._lastPositions[robotId]


class ServoInterface(object):

    def __init__(self):
        self._interfaces = {}
        self._logger = logging.getLogger(__name__)

    @cherrypy.tools.json_out()
    def _getReturn(self, interface):
        ret = {
               'id': interface.servo.id,
               'position': interface.getPosition(),
               }
        try:
            ret['poseable'] = interface.getPositioning()
        except:
            ret['poseable'] = None

        ret['timestamp'] = Helper._utcDateTime(datetime.datetime.now())

        return ret

    def GET(self, servoId, position=None):
        interface = Helper._getInterface(servoId)
        if interface == None:
            raise cherrypy.NotFound()

        currentPosition = interface.getPosition()
        if position != None:
            position = int(position)
            while(currentPosition == position):
                time.sleep(0.1)
                currentPosition = interface.getPosition()

        return self._getReturn(interface)

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, servoId):
        data = cherrypy.request.json
        interface = Helper._getInterface(servoId)
        if interface == None:
            raise cherrypy.NotFound()
        else:
            try:
                if 'position' in data and data['position'] != None:
                    interface.setPosition(int(data['position']), float(data['speed'] or 100))
                if 'poseable' in data and data['poseable'] != None:
                    interface.setPositioning(bool(data['poseable']))
            except Exception as e:
                raise cherrypy.HTTPError(message=e.message)

        return self._getReturn(interface)
