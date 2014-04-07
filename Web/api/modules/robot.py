import datetime
import time
from flask import Blueprint, jsonify, abort
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
__sensorInterfaces = {}
__servoValues = {}
__sensorValues = {}


@__robotInterface.route('/Robot/<int:robotId>/Interface', methods=['GET'])
def __robotInterfaceGet(robotId, timestamp=None):
    servos = __getServoValues(robotId)
    if servos == None:
        abort(404)

    startTime = datetime.datetime.now()
    timeout = 5
    servos = None
    sensors = None
    while (datetime.datetime.now() - startTime).seconds < timeout:
        time.sleep(0.1)
        servos = __getServoValues(robotId)
        sensors = __getSensorValues(robotId)

    if servos == None or sensors == None:
        msg = ''
        if servos == None:
            msg += "Servos, "
        if sensors == None:
            msg += "Sensors, "
        msg = msg[:-2] + " not ready before timeout"
        abort(500, msg)

    if timestamp != None:
        ts = DateUtil.fromUtcDateTime(timestamp)
        servos = [s for s in servos if s['timestamp'] >= ts]
        sensors = [s for s in sensors if s['timestamp'] >= ts]

    ret = {
           'servos': map(
                         lambda (key, value): {
                                             'id': key,
                                             'position': value['position'],
                                             'poseable': value['poseable'],
                                             'jointName': value['jointName'],
                                             }, servos['servos'].iteritems()),
           'sensors': map(
                          lambda (key, value): {
                                                'id': key,
                                                'value': value['value'],
                                                'name': value['name'],
                                                }, sensors['sensors'].iteritems()),
           'timestamp': DateUtil.utcDateTime(servos['timestamp']),
           'id': robotId,
           }

    return jsonify(ret)


@__robotInterface.route('/Robot/<int:robotId>/Interface', methods=['POST'])
def __robotInterfacePost(robotId):
    data = cherrypy.request.json
    for servo in data['servos']:
        servo = db_session.query(Model.Servo).get(servo['id'])
        interface = ServoInterface.getServoInterface(servo)
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
           'timestamp': DateUtil.utcDateTime(),
           }

    return jsonify(ret)


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
    data = cherrypy.request.json
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

        __sensorValues[robotId]['timestamp'] = max(__sensorValues[robotId]['sensors'].values(), key=lambda x: x['timestamp'])['timestamp']

    return __sensorValues[robotId]


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

        __servoValues[robotId]['timestamp'] = max(__servoValues[robotId]['servos'].values(), key=lambda x: x['timestamp'])['timestamp']

    return __servoValues[robotId]


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

