import datetime
import time
from flask import Blueprint, jsonify, abort, request
from utils import DateUtil
from Robot.ServoInterface import ServoInterface
from Processor.SensorInterface import SensorInterface
from Web.api.database import db_session
import Model

models = [
          {
            'class': Model.ServoModel,
            'kwargs': {'methods':['GET'], }
          },
          {'class': Model.Servo, },
          {'class': Model.ServoGroup, },
          {'class': Model.ServoConfig, },
          {
            'class': Model.RobotModel,
            'kwargs': {'methods':['GET'], }
          },
          {'class': Model.Robot, }
         ]


__robotInterface = Blueprint('robot.interface', __name__)
__servoInterface = Blueprint('servo.interface', __name__)
blueprints = [
              __robotInterface,
              __servoInterface,
             ]

__servoInterfaces = {}
__servoValues = {}
__sensorInterfaces = {}
__sensorValues = {}


@__robotInterface.route('/Robot/<int:robotId>/Interface', methods=['GET'])
def __robotInterfaceGet(robotId):
    timestamp = request.args.get('timestamp', None)
    startTime = datetime.datetime.now()
    responseTimeout = 60
    servos = None
    sensors = None

    while (datetime.datetime.now() - startTime).seconds < responseTimeout and not servos and not sensors:
        servos = __getServoValues(robotId)
        sensors = __getSensorValues(robotId)

        if timestamp != None:
            ts = DateUtil.fromUtcDateTime(timestamp)
            for sId, sVal in servos.items():
                if sVal['timestamp'] <= ts:
                    servos.pop(sId)
            for sId, sVal in sensors.items():
                if sVal['timestamp'] <= ts:
                    sensors.pop(sId)

        if not sensors and not servos:
            time.sleep(0.001)

    ret = {
           'servos': map(
                         lambda (key, value): {
                                             'id': key,
                                             'position': value['position'],
                                             'poseable': value['poseable'],
                                             'jointName': value['jointName'],
                                             }, servos.iteritems()),
           'sensors': map(
                          lambda (key, value): {
                                                'id': key,
                                                'value': value['value'],
                                                'name': value['name'],
                                                }, sensors.iteritems()),
           'id': robotId,
           }

    if servos or sensors:
        timestamps = []
        timestamps.extend([s['timestamp'] for s in servos.itervalues()])
        timestamps.extend([s['timestamp'] for s in sensors.itervalues()])
        ret['timestamp'] = DateUtil.utcDateTime(max(timestamps))
    else:
        ret['timestamp'] = timestamp

    return jsonify(ret)


@__robotInterface.route('/Robot/<int:robotId>/Interface', methods=['POST'])
def __robotInterfacePost(robotId):
    try:
        data = request.json
        for servo in data.get('servos', []):
            if servo.get('id', None) == None:
                continue
            servo = db_session.query(Model.Servo).get(servo['id'])
            interface = ServoInterface.getServoInterface(servo)
            if interface == None:
                # TODO: Error handling
                continue
                # raise cherrypy.NotFound()
            else:
                try:
                    if servo.get('position', None) != None:
                        interface.setPosition(int(servo['position']), 100)
                    if servo.get('poseable', None) != None:
                        interface.setPositioning(bool(servo['poseable']))
                except Exception:
                    # TODO: Error handling
                    continue
                    # raise cherrypy.HTTPError(message=e.message)
    except Exception as e:
        print e

    return __robotInterfaceGet(robotId)


@__servoInterface.route('/Servo/<int:servoId>/Interface', methods=['GET'])
def __servoInterfaceGet(servoId, position=None):
    servo = db_session.query(Model.Servo).get(servoId)
    interface = ServoInterface.getServoInterface(servo)
    if interface == None:
        raise abort(404)

    currentPosition = interface.getPosition()
    if position != None:
        position = int(position)
        while(currentPosition == position):
            time.sleep(0.1)
            currentPosition = interface.getPosition()

    return jsonify(__getReturn(interface))


@__servoInterface.route('/Servo/<int:servoId>/Interface', methods=['POST'])
def __servoInterfacePost(servoId):
    data = request.json
    try:
        servo = db_session.query(Model.Servo).get(servoId)
        interface = ServoInterface.getServoInterface(servo)
    except Exception as e:
        abort(500, "Error connecting to servos: %s" % e.message)

    if interface == None:
        abort(404)
    else:
        try:
            if 'position' in data and data['position'] != None:
                if 'speed' in data and data['speed'] != None:
                    interface.setPosition(data['position'], data['speed'])
                else:
                    interface.setPosition(data['position'], 100)
            if 'poseable' in data and data['poseable'] != None:
                interface.setPositioning(data['poseable'])
        except Exception as e:
            abort(500, e.message)

    return jsonify(__getReturn(interface))


def __getSensorValues(robotId):
    robot = db_session.query(Model.Robot).get(robotId)
    if robot == None:
        return None
    else:
        if robotId not in __sensorValues:
            __sensorValues[robotId] = {'timestamp': None, 'sensors': {}}

        for sensor in robot.sensors:
            if sensor.id not in __sensorValues[robotId]['sensors']:
                __sensorValues[robotId]['sensors'][sensor.id] = {'value': None, 'timestamp': None, 'name': sensor.name}

            if sensor.id not in __sensorInterfaces:
                sensor = db_session.query(Model.Sensor).get(sensor.id)
                interface = SensorInterface.getSensorInterface(sensor)
                __sensorInterfaces[sensor.id] = interface
            else:
                interface = __sensorInterfaces[sensor.id]

            if interface == None:
                continue

            curValue = interface.getCurrentValue()
            if __sensorValues[robotId]['sensors'][sensor.id]['value'] != curValue:
                __sensorValues[robotId]['sensors'][sensor.id]['value'] = curValue
                __sensorValues[robotId]['sensors'][sensor.id]['timestamp'] = datetime.datetime.now()

    return __sensorValues[robotId]['sensors'].copy()


def __getServoValues(robotId):
    robot = db_session.query(Model.Robot).get(robotId)
    if robot == None:
        return None
    else:
        if robotId not in __servoValues:
            __servoValues[robotId] = {'timestamp': None, 'servos': {}}

        for servo in robot.servos:
            if servo.id not in __servoValues[robotId]['servos']:
                __servoValues[robotId]['servos'][servo.id] = {'position': None, 'poseable': None, 'timestamp': None, 'jointName': servo.jointName}

            if servo.id not in __servoInterfaces:
                servo = db_session.query(Model.Servo).get(servo.id)
                interface = ServoInterface.getServoInterface(servo)
                __servoInterfaces[servo.id] = interface
            else:
                interface = __servoInterfaces[servo.id]

            if interface == None:
                continue

            currentPos = interface.getPosition()
            if __servoValues[robotId]['servos'][servo.id]['position'] != currentPos:
                __servoValues[robotId]['servos'][servo.id]['position'] = currentPos
                __servoValues[robotId]['servos'][servo.id]['timestamp'] = datetime.datetime.now()

            curPoseable = interface.getPositioning()
            if __servoValues[robotId]['servos'][servo.id]['poseable'] != curPoseable:
                __servoValues[robotId]['servos'][servo.id]['poseable'] = curPoseable
                __servoValues[robotId]['servos'][servo.id]['timestamp'] = datetime.datetime.now()

    return __servoValues[robotId]['servos'].copy()


def __getReturn(interface):
    ret = {
           'id': interface.servoId,
           'position': interface.getPosition(),
           }
    try:
        ret['poseable'] = interface.getPositioning()
    except:
        ret['poseable'] = None

    ret['timestamp'] = DateUtil.utcDateTime()

    return ret

