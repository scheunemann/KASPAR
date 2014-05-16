import time
from threading import RLock
import datetime
from flask import request
from flask.json import dumps
from flask.ext.socketio import SocketIO, emit, join_room, leave_room
from Web.api.database import db_session
import Model
from Robot.ServoInterface import ServoInterface
from Processor.SensorInterface import SensorInterface
from threading import Thread

socketio = SocketIO()

__robots = {}
__robotLock = RLock()

__NAMESPACE = '/Robot/Interface'
__SERVERMSG = 'getData'
__CLIENTMSG = 'setData'


import logging
log = logging.getLogger(__name__)


def init_app(app):
    socketio.init_app(app)
    app.before_first_request_funcs.append(_start_loop)


def sendMessage(robotId, msg):
    args = (dumps(msg),)
    kwargs = {'namespace': __NAMESPACE, 'room': robotId}
    if request:
        emit(__SERVERMSG, *args, **kwargs)
    else:
        socketio.emit(__SERVERMSG, *args, **kwargs)


@socketio.on(__CLIENTMSG, namespace=__NAMESPACE)
def receiveMessage(data):
    # data = {u'servos': [{u'position': u'0', u'jointName': u'EYES_UD', u'id': None, u'poseable': None}, ], u'id': 1}
    try:
        robotId = data.get('robotId', None)
        if robotId == None:
            # TODO: error handling
            log.warning('No robotId received in packet')
            return
        robot = _getRobot(robotId)
        for servoData in data.get('servos', []):
            servoId = servoData.get('id', None)
            if servoId == None:
                log.warning('No servoId received in packet')
                # TODO: Error handling
                continue

            servo = robot['servos'].get(servoId, None)
            if servo == None:
                log.warning('Wrong servoId %s for robot %s' % (servoId, robotId))
                # TODO: Error handling
                continue
            else:
                try:
                    interface = servo['interface']
                    if 'position' in servoData:
                        interface.setPosition(servoData.get('position', None), servoData.get('speed', None))
                    if 'poseable' in servoData:
                        interface.setPositioning(servoData.get('poseable', False))
                except Exception as e:
                    # TODO: Error handling
                    continue
    except Exception as e:
        # TODO: Error handling
        print e


@socketio.on('configure', namespace='/Robot/Interface')
def configure(data):
    robotId = data.get('robotId', None)
    connect = data.get('connect', False)
    if connect:
        robot = _getRobot(robotId)
        msg = _getRobotPacket(robotId, robot)
        join_room(robotId)
        sendMessage(robotId, msg)
    else:
        leave_room(robotId)


def _start_loop():
    log.debug("Spawning internal loop")
    t = Thread(target=_loop_internal)
    t.start()


def _loop_internal():
    lastMsgs = {}
    while True:
        with __robotLock:
            robots = __robots.iteritems()
        for robotId, robot in robots:
            if len(socketio.rooms.get(__NAMESPACE, {}).get(robotId, [])):
                lastMsg = lastMsgs.get(robotId, None)
                lastMsgs[robotId] = datetime.datetime.utcnow()
                _updateStatus(robot)
                msg = _getRobotPacket(robotId, robot, lastMsg)
                if msg['sensors'] or msg['servos']:
                    log.debug('Sending robot state')
                    sendMessage(robotId, msg)

        time.sleep(0.01)


def _getRobotPacket(robotId, robot, timefilter=None):
    pkt = {
           'id': robotId,
           'timestamp': datetime.datetime.utcnow(),
           'sensors': [],
           'servos': [],
           }
    for servoId, servo in robot['servos'].iteritems():
        if servo['timestamp']:
            if not timefilter or timefilter and servo['timestamp'] > timefilter:
                pkt['servos'].append({
                 'id': servoId,
                 'value': servo['value'],
                 'poseable': servo['poseable'],
                 'timestamp': servo['timestamp'],
                 'name': servo['name'],
                 })

    for sensorId, sensor in robot['sensors'].iteritems():
        if sensor['timestamp']:
            if not timefilter or timefilter and sensor['timestamp'] > timefilter:
                pkt['sensors'].append({
                 'id': sensorId,
                 'value': sensor['value'],
                 'name': sensor['name'],
                 'timestamp': sensor['timestamp'],
                 })
    return pkt


def _getRobot(robotId):
    if robotId not in __robots:
        newRobot = {
               'servos': {},
               'sensors': {},
               'lastUpdate': None
               }
        robot = db_session.query(Model.Robot).get(robotId)
        if robot:
            for servo in robot.servos:
                newRobot['servos'][servo.id] = {
                                            'value': None,
                                            'poseable': None,
                                            'timestamp': None,
                                            'name': servo.jointName,
                                            'interface': ServoInterface.getServoInterface(servo)
                                           }

            for sensor in robot.sensors:
                newRobot['sensors'][sensor.id] = {
                                             'value': None,
                                             'timestamp': None,
                                             'name': sensor.name,
                                             'interface': SensorInterface.getSensorInterface(sensor)
                                             }
            with __robotLock:
                __robots[robotId] = newRobot

    return __robots.get(robotId, None)


def _updateStatus(robot):
    for sensor in robot['sensors'].itervalues():
        newVal = sensor['interface'].getCurrentValue()
        if newVal != sensor['value']:
            sensor['value'] = newVal
            sensor['timestamp'] = datetime.datetime.utcnow()
            robot['lastUpdate'] = sensor['timestamp']

    for servo in robot['servos'].itervalues():
        newVal = servo['interface'].getPosition()
        newPos = servo['interface'].getPositioning()
        if newVal != servo['value'] or newPos != servo['poseable']:
            servo['value'] = newVal
            servo['poseable'] = newPos
            servo['timestamp'] = datetime.datetime.utcnow()
            robot['lastUpdate'] = sensor['timestamp']
