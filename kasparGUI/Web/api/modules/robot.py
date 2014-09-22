import datetime
import time
import logging
from flask import Blueprint, jsonify, abort, request
from utils import DateUtil
from robotActionController.Robot.ServoInterface import ServoInterface
from robotActionController.Processor.SensorInterface import SensorInterface
from kasparGUI.Web.api.database import db_session
import kasparGUI.Model as Model

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
    startTime = datetime.datetime.utcnow()
    responseTimeout = 60
    servos = None
    sensors = None

    while (datetime.datetime.utcnow() - startTime).seconds < responseTimeout and not servos and not sensors:
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
        ret['timestamp'] = max(timestamps).isoformat()
    else:
        ret['timestamp'] = timestamp.isoformat()

    return jsonify(ret)


@__robotInterface.route('/Robot/<int:robotId>/Interface', methods=['POST'])
def __robotInterfacePost(robotId):
    try:
        data = request.json
        for servoData in data.get('servos', []):
            if servoData.get('id', None) == None:
                continue
            servo = db_session.query(Model.Servo).get(servoData['id'])
            interface = ServoInterface.getServoInterface(servo)
            if interface == None:
                # TODO: Error handling
                continue
                # raise cherrypy.NotFound()
            else:
                try:
                    if servoData.get('position', None) != None:
                        interface.setPosition(float(servoData['position']), 100)
                    if servoData.get('poseable', None) != None:
                        interface.setPositioning(bool(servoData['poseable']))
                except Exception:
                    logging.getLogger().error("Error setting position.", exc_info=True)
                    # TODO: Error handling
                    continue
    except Exception:
        logging.getLogger().error("Error setting position.", exc_info=True)

    return __robotInterfaceGet(robotId)


@__servoInterface.route('/Servo/<int:servoId>/Interface', methods=['GET'])
def __servoInterfaceGet(servoId, position=None):
    if servoId not in __servoInterfaces:
        servo = db_session.query(Model.Servo).get(servoId)
        interface = ServoInterface.getServoInterface(servo)
        __servoInterfaces[servo.id] = interface

    interface = __servoInterfaces.get(servoId, None)
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
    if servoId not in __servoInterfaces:
        servo = db_session.query(Model.Servo).get(servoId)
        interface = ServoInterface.getServoInterface(servo)
        __servoInterfaces[servo.id] = interface

    interface = __servoInterfaces.get(servoId, None)
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
    if robotId == None:
        return None
    else:
        if robotId not in __sensorValues:
            __sensorValues[robotId] = {'timestamp': None, 'sensors': {}}
            robot = db_session.query(Model.Robot).get(robotId)
            for sensor in robot.sensors:
                if sensor.id not in __sensorValues[robotId]['sensors']:
                    __sensorValues[robotId]['sensors'][sensor.id] = {'value': None, 'timestamp': None, 'name': sensor.name}
                if sensor.id not in __sensorInterfaces:
                    sensor = db_session.query(Model.Sensor).get(sensor.id)
                    interface = SensorInterface.getSensorInterface(sensor)
                    __sensorInterfaces[sensor.id] = interface

        for sensorId, sensor in __sensorValues[robotId]['sensors'].iteritems():
            interface = __sensorInterfaces.get(sensorId, None)

            if interface == None:
                continue

            curValue = interface.getCurrentValue()
            if sensor['value'] != curValue:
                sensor['value'] = curValue
                sensor['timestamp'] = datetime.datetime.utcnow()

    return __sensorValues[robotId]['sensors'].copy()


def __getServoValues(robotId):
    if robotId == None:
        return None
    else:
        if robotId not in __servoValues:
            __servoValues[robotId] = {'timestamp': None, 'servos': {}}
            robot = db_session.query(Model.Robot).get(robotId)
            for servo in robot.servos:
                __servoValues[robotId]['servos'][servo.id] = {'position': None, 'poseable': None, 'timestamp': None, 'jointName': servo.jointName}
                if servo.id not in __servoInterfaces:
                    servo = db_session.query(Model.Servo).get(servo.id)
                    interface = ServoInterface.getServoInterface(servo)
                    __servoInterfaces[servo.id] = interface

        for servoId, servo in __servoValues[robotId]['servos'].iteritems():
            interface = __servoInterfaces.get(servoId, None)

            if interface == None:
                continue

            currentPos = interface.getPosition()
            if servo['position'] != currentPos:
                servo['position'] = currentPos
                servo['timestamp'] = datetime.datetime.utcnow()

            curPoseable = interface.getPositioning()
            if servo['poseable'] != curPoseable:
                servo['poseable'] = curPoseable
                servo['timestamp'] = datetime.datetime.utcnow()

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

    ret['timestamp'] = datetime.datetime.utcnow()

    return ret

