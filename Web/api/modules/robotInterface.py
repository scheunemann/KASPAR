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
loop = None

def init_app(app):
    socketio.init_app(app)
    #app.before_first_request_funcs.append(_start_loop)
    if loop == None:
        _start_loop()


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
        robotId = data.get('id', None)
        if robotId == None:
            # TODO: error handling
            log.warning('No robotId received in packet')
            return
        robot = _getRobot(robotId)
        for servoData in data.get('servos', []):
            servoId = servoData.get('id', None)
            #if servoId == None and servoData.get('jointName', None):
            #    matches = [k for k, v in robot['servos'].iteritems() if v['jointName'] == servoData['jointName']]
            #    if not matches:
            #        # TODO: Error handling
            #        log.warning('No servoId received in packet')
            #        continue
            #    else:
            #        servoId = matches[0]

            #servo = robot['servos'].get(servoId, None)
            servos = filter(lambda s: s['jointName'] == servoData.get('jointName'), robot['servos'].values())
            if servos:
                servo = servos[0]
            else:
                servo = None
            if servo == None:
                log.warning('Wrong servoId %s for robot %s' % (servoId, robotId))
                # TODO: Error handling
                continue
            else:
                try:
                    interface = servo['interface']
                    log.debug("Setting position using : %s" % (servoData, ))
                    position = servoData.get('position', None)
                    poseable = servoData.get('poseable', None)
                    if position != None:
                        #log.debug(interface)
                        interface.setPosition(float(position), servoData.get('speed', 100))
                    if poseable != None:
                        interface.setPositioning(poseable)
                except Exception as e:
                    # TODO: Error handling
                    log.error(e, exc_info=True)
                    continue
    except Exception as e:
        # TODO: Error handling
        log.error(e, exc_info=True)


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
    log = logging.getLogger(__name__)
    log.debug("Spawning robot state polling loop")
    loop = Thread(target=_loop_internal, args=(log, ))
    loop.daemon = True
    loop.start()


def _loop_internal(log):
    lastMsgs = {}
    while True:
        try:
            with __robotLock:
                robots = __robots.iteritems()
            for robotId, robot in robots:
                numListeners = len(socketio.rooms.get(__NAMESPACE, {}).get(robotId, []))
                if numListeners:
                    lastMsg = lastMsgs.get(robotId, None)
                    lastMsgs[robotId] = datetime.datetime.utcnow()
                    _updateStatus(robot, log)
                    msg = _getRobotPacket(robotId, robot, lastMsg)
                    if msg['sensors'] or msg['servos']:
                        log.log(1, 'Sending robot state to %s listeners' % numListeners)
                        sendMessage(robotId, msg)
        except Exception as e:
            log.warning('Error occurred!', exc_info=True)

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
                 'jointName': servo['jointName'],
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
                                            'jointName': servo.jointName,
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


def _updateStatus(robot, log):
    for sensor in robot['sensors'].itervalues():
        try:
            newVal = sensor['interface'].getCurrentValue()
        except Exception as e:
            log.error('Unable to get sensor value', exc_info=True)
            continue

        if newVal != sensor['value']:
            sensor['value'] = newVal
            sensor['timestamp'] = datetime.datetime.utcnow()
            robot['lastUpdate'] = sensor['timestamp']

    for servo in robot['servos'].itervalues():
        try:
            newVal = servo['interface'].getPosition()
            newPos = servo['interface'].getPositioning()
        except Exception as e:
            log.error('Unable to get servo position', exc_info=True)
            continue

        if newVal != servo['value'] or newPos != servo['poseable']:
            servo['value'] = newVal
            servo['poseable'] = newPos
            servo['timestamp'] = datetime.datetime.utcnow()
            robot['lastUpdate'] = sensor['timestamp']
