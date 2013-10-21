import logging
from threading import RLock
from connections import Connection

__all__ = ['ServoInterface', ]

class ServoInterface(object):
    
    _servoInterfaces = {}
    _globalLock = RLock()
    
    @staticmethod
    def getServoInterface(servo):
        with ServoInterface._globalLock:
            if not ServoInterface._servoInterfaces.has_key(servo):
                if 'disconnected' in globals() and not disconnected: #Global flag
                    if servo.type.name == "AX12":
                        servoInt = AX12(servo)
                    if servo.type.name == "MINISSC":
                        servoInt = MINISSC(servo)
                    if servo.type.name == "SSC32":
                        servoInt = SSC32(servo)
                    if servo.type.name == "HerculeX":
                        servoInt = HerculeX(servo)
                    else:
                        logging.getLogger(__name__).critical("No known interface for servo type: %s", servo.type.name)
                        raise ValueError
                else:
                    servoInt = Dummy(servo)
                 
                ServoInterface._servoInterfaces[servo] = servoInt 
             
            return ServoInterface._servoInterfaces[servo]
    
    def __init__(self, servo):
        self._servo = servo
        
        # servo properties
        self._minPos = servo.minPosition
        self._maxPos = servo.maxPosition
        self._defaultPos = servo.defaultPosition
        self._minSpeed = servo.minSpeed
        self._maxSpeed = servo.maxSpeed
        self._defaultSpeed = servo.defaultSpeed

        # servo type properties
        config = filter(lambda c: c.type == servo.type, servo.robot.servoConfigs)[0]
        self._port = config.port
        self._portSpeed = config.portSpeed
        self._speedScaleValue = config.speedScale
        self._posScaleValue = config.rotationScale
        self._posOffset = config.rotationOffset
        
        self._logger = logging.getLogger(__name__)
                        
    def setPositioning(self, enablePositioning):
        raise ValueError('Manual positioning not supported on servo %s', self._servo)

    def getPositioning(self):
        raise ValueError('Manual positioning not supported on servo %s', self._servo)
    
    def setPosition(self, position, speed):
        raise ValueError('Setting position not supported on servo %s', self._servo)

    def getPosition(self):
        raise ValueError('Getting position not supported on servo %s', self._servo)
    
    def _scaleToRealPos(self, value):
        real = (value / self._posScaleValue) + self._posOffset
        return round(real, 2)

    def _realToScalePos(self, value):
        scaled = (value - self._posOffset) * self._posScaleValue
        return round(scaled, 2)

    def _scaleToRealSpeed(self, value):
        real = value / self._speedScaleValue
        return round(real, 2)

    def _realToScaleSpeed(self, value):
        scaled = value * self._speedScaleValue
        return round(scaled, 2)

    def _getInRangeVal(self, val, minVal, maxVal):
        val = max(minVal, val)
        val = min(maxVal, val)
        return val

class AX12(ServoInterface):
    
    def __init__(self, servo):
        super(AX12, self).__init__(servo)
        self._externalId = servo.extraData.get('externalId', None)
        if self._externalId == None:
            self._logger.critical("AX12 servo %s is missing its external Id!", servo.name)

        self._conn = Connection.getConnection("AX12", self._port, self._portSpeed)
        self._checkMinMaxValues()
        self._reactive = False
        self._positioning = False
    
    def getPosition(self):
        with Connection.getLock(self._conn):
            posSteps = self._conn.GetPosition(self._externalId)
            return self._realToScalePos(posSteps)
    
    def setPosition(self, position, speed):
        scaledSpeed = self._scaleToRealSpeed(speed)
        scaledPosition = self._scaleToRealPos(position)
        with Connection.getLock(self._conn):
            self._conn.SetMovingSpeed(self._externalId, scaledSpeed)
            self._conn.SetPosition(self._externalId, scaledPosition)
    
    def getPositioning(self):
        return self._positioning
    
    def setPositioning(self, enablePositioning):
        with Connection.getLock(self._conn):
            self._conn.SetTorqueEnable(self._externalId, int(not enablePositioning))
            self._positioning = enablePositioning
    
    def _checkMinMaxValues(self):
        # We can check the hardware limits set in the servos
        with Connection.getLock(self._conn):
            readMinPos = self._conn.GetCWAngleLimit(self._externalId)
            readMaxPos = self._conn.GetCCWAngleLimit(self._externalId)
    
        if readMinPos > self._minPos:
            # The motor doesn't allow for the minimum defined so far!
            self._logger.warning("Requested minimum value of %s lower than hardware limits (%s) for servo %s", self._minPos, readMinPos, self._externalId)
            self._minPos = readMinPos
        if readMaxPos < self._maxPos:
            # The motor doesn't allow for the maximum defined so far!
            self._logger.warning("Requested maximum value of %s higher than hardware limits (%s) for servo %s", self._maxPos, readMaxPos, self._externalId)
            self._maxPos = readMaxPos
        # TODO: posScaleValue isn't used like this anymore???
        if self._defaultPos < 0 or self._defaultPos > self._posScaleValue:
            # The motor doesn't allow for this d!
            self._logger.warning("Requested default value of %s outside allowed interval [0,%s] for servo %s", self._defaultPos, self._posScaleValue, self._externalId)
            self._defaultPos = self._posScaleValue / 2

class MINISSC(ServoInterface):
    
    def __init__(self, servo):
        super(MINISSC, self).__init__(servo)
        self._externalId = servo.extraData.get('externalId', None)
        if self._externalId == None:
            self._logger.critical("MINISSC servo %s is missing its external Id!", servo.name)

        self._conn = Connection.getConnection("SERIAL", self._port, self._portSpeed)
        self._checkMinMaxValues()
        self._reactive = False
        
    def getPosition(self):
        return self._lastPosition
    
    def setPosition(self, position, speed):
        validTarget = self._getInRangeVal(position, self._minPos, self._maxPos)
        if position != validTarget:
            self._logger.warning("Target position has to be between %s and %s, got %s", self._minPos, self._maxPos, position)
            # Force target to be within range
            position = validTarget

        pos = self._scaleToRealPos(position)
        self._lastPosition = pos
        send = [0xFF, self._externalId, position]
        with Connection.getLock(self._conn):
            self._conn.write(send)

class HerculeX(ServoInterface):
    
    def __init__(self, servo):
        super(HerculeX, self).__init__(servo)
        self._externalId = servo.extraData.get('externalId', None)
        if self._externalId == None:
            self._logger.critical("HerculeX servo %s is missing its external Id!", servo.name)
        
        self._conn = Connection.getConnection("HERKULEX", self._port, self._portSpeed)
        self._positioning = False

    def getPosition(self):
        with Connection.getLock(self._conn):
            posSteps = self._conn.getPosition(self._externalId)
            return self._realToScalePos(posSteps)
    
    def setPosition(self, position, speed):
        scaledPosition = self._scaleToRealPos(position)
        scaledSpeed = self._scaleToRealSpeed(speed)
        totalSteps = abs(scaledPosition - self._conn.getPosition(self._externalId))
        scaledSpeed = scaledSpeed * totalSteps
        
        with Connection.getLock(self._conn):
            self._conn.moveOne(self._externalId, scaledPosition, scaledSpeed)
    
    def getPositioning(self):
        return self._positioning
    
    def setPositioning(self, enablePositioning):
        with Connection.getLock(self._conn):
            if enablePositioning:
                self._conn.torqueOFF(self._externalId)
            else:
                self._conn.torqueON(self._externalId)
            self._positioning = enablePositioning

class SSC32(ServoInterface):
    
    def __init__(self, servo):
        super(SSC32, self).__init__(servo)
        self._externalId = servo.extraData.get('externalId', None)
        if self._externalId == None:
            self._logger.critical("MINISSC servo %s is missing its external Id!", servo.name)

        self._conn = Connection.getConnection("SERIAL", self._port, self._portSpeed)
        self._checkMinMaxValues()
        self._reactive = False
        
    def getPosition(self):
        send = "QP %s\r" % self._externalId
        with Connection.getLock(self._conn):
            self._conn.write(send)
            lastChar = ""
            response = ""
            while lastChar <> '\r':
                lastChar = self._conn.read(1)
                response += lastChar
        
        response = response.strip(['\r', ])
        p = int(response)
        return self._realToScalePos(p * 10)
    
    def setPosition(self, position, speed):
        validTarget = self._getInRangeVal(position, self._minPos, self._maxPos)
        if position != validTarget:
            self._logger.warning("Target position has to be between %s and %s, got %s", self._minPos, self._maxPos, position)
            # Force target to be within range
            position = validTarget

        pos = self._scaleToRealPos(position)
        spd = self._scaleToRealSpeed(speed)

        send = "#%sP%s T%s\r" % (self._externalId, pos, spd)
        self._logger.info("Sending SSC32 String: %s", send)
        with Connection.getLock(self._conn):
            self._conn.write(send)
    
class Dummy(ServoInterface):
    
    def __init__(self, servo):
        super(Dummy, self).__init__(servo)
        self._position = 0
        self._posable = False
        self._logger = logging.getLogger(__name__)
        
    def setPositioning(self, enablePositioning):
        self._posable = enablePositioning
        self._logger.debug("Servo: %s Set positioning to: %s", self._servo, enablePositioning)
        self._writeData()

    def getPositioning(self):
        self._readData()
        return self._posable
    
    def setPosition(self, position, speed):
        self._position = position
        self._logger.debug("Servo: %s Set position to: %s", self._servo, position)
        self._writeData()

    def getPosition(self):
        self._readData()
        self._logger.warning("Servo: %s Got position: %s", self._servo, self._position)
        return self._position
    
    def _readData(self):
        import pickle
        try:
            data = pickle.load(open(str(self._servo.id) + '_dummyData', 'r'))
            self._position = data['position']
            self._posable = data['posable']
        except:
            pass
        
    def _writeData(self):
        import pickle
        try:
            data = {'position':self._position, 'posable':self._posable}
            pickle.dump(data, open(str(self._servo.id) + '_dummyData', 'w'))
        except:
            pass