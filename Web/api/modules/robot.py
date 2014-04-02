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


@__robotInterface.route('/Robot/Interface/<int:oid>?<timestamp>', methods=['GET'])
def __robotInterfaceGet(robotId, timestamp=None):
    servos = __getServos(robotId)
    if servos == None:
        abort(404)

    startTime = datetime.datetime.now()
    timeout = 5
    if timestamp != None:
        while servos['timestamp'] <= DateUtil.fromUtcDateTime(timestamp) and (datetime.datetime.now() - startTime).seconds < timeout:
            time.sleep(0.1)
            servos = __getServos(robotId)
            sensors = __getSensors(robotId)

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
                                                'value': value['value']
                                                }, sensors['']),
           'timestamp': DateUtil.utcDateTime(servos['timestamp']),
           }

    return jsonify(ret)


@__robotInterface.route('/Robot/Interface/<int:oid>', methods=['POST'])
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

__lastPositions = {}
__lastValues = {}


def __getSensors(robotId):
    robot = db_session.query(Model.Robot).get(robotId)
    if robot == None:
        return None
    else:
        if robotId not in __lastPositions:
            __lastValues[robotId] = {'timestamp': None, 'sensors': {}}

        for sensor in robot.sensors:
            if sensor.id not in __lastValues[robotId]['sensors']:
                __lastValues[robotId]['sensors'][sensor.id] = {'value': None, 'timestamp': None}

            sensor = db_session.query(Model.Sensor).get(sensor.id)
            interface = SensorInterface.getSensorInterface(sensor)
            if interface == None:
                continue
            currentPos = interface.getPosition()
            if __lastValues[robotId]['sensors'][sensor.id]['position'] != currentPos:
                __lastValues[robotId]['sensors'][sensor.id]['position'] = currentPos
                __lastValues[robotId]['sensors'][sensor.id]['timestamp'] = datetime.datetime.now()

        __lastValues[robotId]['timestamp'] = max(__lastValues[robotId]['sensors'].values(), key=lambda x: x['timestamp'])['timestamp']

    return __lastValues[robotId]


def __getServos(robotId):
    robot = db_session.query(Model.Robot).get(robotId)
    if robot == None:
        return None
    else:
        if robotId not in __lastPositions:
            __lastPositions[robotId] = {'timestamp': None, 'servos': {}}

        for servo in robot.servos:
            if servo.id not in __lastPositions[robotId]['servos']:
                __lastPositions[robotId]['servos'][servo.id] = {'position': None, 'poseable': None, 'timestamp': None}

            servo = db_session.query(Model.Servo).get(servo.id)
            interface = ServoInterface.getServoInterface(servo)
            if interface == None:
                continue
            currentPos = interface.getPosition()
            if __lastPositions[robotId]['servos'][servo.id]['position'] != currentPos:
                __lastPositions[robotId]['servos'][servo.id]['position'] = currentPos
                __lastPositions[robotId]['servos'][servo.id]['timestamp'] = datetime.datetime.now()

        __lastPositions[robotId]['timestamp'] = max(__lastPositions[robotId]['servos'].values(), key=lambda x: x['timestamp'])['timestamp']

    return __lastPositions[robotId]


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


@__servoInterface.route('/Servo/Interface/<int:oid>', methods=['GET'])
def __servoInterfaceGet(oid, position=None):
    servo = db_session.query(Model.Servo).get(oid)
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


@__servoInterface.route('/Servo/Interface/<int:oid>', methods=['POST'])
def __servoInterfacePost(oid):
    data = cherrypy.request.json
    try:
        servo = db_session.query(Model.Servo).get(oid)
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
