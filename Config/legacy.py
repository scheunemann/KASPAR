import os, sys
from xml.etree import ElementTree as et
from Data.Model import Robot, RobotModel, Servo, ServoGroup, ServoModel, ServoConfig, Pose, JointPosition, SensorTrigger, ButtonTrigger, ButtonHotKey

class KasparImporter(object):
    
    _types = {}
    _models = {}
    _configs = {
                #SSC32 and MINISSC limits are inconsistent between the config files and the old java interface
                'SSC32': {
                            'MAX_POS' : 5000,
                            'MIN_POS' : 500,
                            'MAX_SPEED' : 10000,
                            'MIN_SPEED' : 5,
                            'POSEABLE' : False,
                            'SCALE_SPEED' : 100.0 / 5000.0,
                            'SCALE_POS' : 360.0 / 5000.0,
                            },
                'MINISSC': {
                            'MAX_POS' : 254,
                            'MIN_POS' : 0,
                            'MAX_SPEED' : None, #Unsupported
                            'MIN_SPEED' : None, #Unsupported
                            'POSEABLE' : False,
                            'SCALE_SPEED' : None,
                            'SCALE_POS' : 360.0 / 254.0,
                            },
                'DEFAULT': {
                            'MAX_POS' : 1023,
                            'MIN_POS' : 0,    
                            'MAX_SPEED' : 2048,
                            'MIN_SPEED' : 10,
                            'POSEABLE' : True,
                            'SCALE_SPEED' : 100.0 / 1023.0,
                            'SCALE_POS' : 360.0 / 1023.0,
                            }
                }
    
    def __init__(self, version):
        robotConfig = os.path.join(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'kasparConfigs/%s/robot.xml' % version.lower()))
        if os.path.exists(robotConfig) and os.path.isfile(robotConfig):
            self._config = et.parse(robotConfig).getroot()
        else:
            raise Exception('Cannot locate robot.xml for version %s (path: %s)' % (version, robotConfig))
        
        self._version = self._config.get('version')
    
    def getRobot(self):
        r = Robot(name=self._getText('NAME', None, 'KASPAR'), version=self._version)
        r.servoGroups = self._getServoGroups()
        r.servos = self._getServos(r.servoGroups)
        r.servoConfigs = self._getServoConfigs()
        r.model = self._getModel('KASPAR')
        
        return r
    
    def _getModel(self, modelName):
        if modelName == None:
            return None
        
        if not KasparImporter._models.has_key(modelName):
            KasparImporter._models[modelName] = RobotModel(modelName)
            
        return self._models[modelName]
    
    def _getServos(self, servoGroups):
        servos = []
        for servo in self._get("SERVOLIST/SERVO"):
            s = Servo()
            s.jointName = self._getText("NAME", servo)
            s.model = self._getServoModel(servo.get('type', None))
            s.minPosition = self._realToScalePos(self._getText("LIMITS[@type='pos']/MIN", servo), s.model.positionOffset, s.model.positionScale)
            s.maxPosition = self._realToScalePos(self._getText("LIMITS[@type='pos']/MAX", servo), s.model.positionOffset, s.model.positionScale)
            s.defaultPosition = self._realToScalePos(self._getText("DEFAULT/POS", servo), s.model.positionOffset, s.model.positionScale)
            s.minSpeed = self._realToScaleSpeed(self._getText("LIMITS[@type='speed']/MIN", servo), s.model.speedScale)
            s.maxSpeed = self._realToScaleSpeed(self._getText("LIMITS[@type='speed']/MAX", servo), s.model.speedScale)
            s.extraData = {'externalId': int(servo.get('id', -1))}
            if s.minSpeed > s.maxSpeed:
                temp = s.minSpeed
                s.minSpeed = s.maxSpeed
                s.maxSpeed = temp
            
            s.defaultSpeed = self._realToScaleSpeed(self._getText("DEFAULT/SPEED", servo), s.model.speedScale)
            if s.defaultSpeed < s.minSpeed:
                s.defaultSpeed = s.minSpeed
            if s.defaultSpeed > s.maxSpeed:
                s.defaultSpeed = s.maxSpeed
            
            s.groups = self._getGroupsForServo(s, servoGroups)
            servos.append(s)
        
        return servos
    
    def _getGroupsForServo(self, servo, groupList):
        groups = []
        for node in self._get("SERVOLIST/SERVOGROUP"):
            for member in self._get("MEMBER", node):
                if member.text == servo.jointName:
                    for group in groupList:
                        if group.name == self._getText("NAME", node):
                            groups.append(group)
                            break
                    break
                        
        return groups
    
    def _getServoGroups(self):
        groups = []
        for group in self._get("SERVOLIST/SERVOGROUP"):
            s = ServoGroup(name=self._getText("NAME", group))
            groups.append(s)
            
        return groups
        
    def _realToScalePos(self, value, offset, scaleValue):
        if value == None:
            return None
        
        value = float(value)
        scaled = (value - offset) * scaleValue
        return round(scaled, 2)

    def _realToScaleSpeed(self, value, scaleValue):
        if value == None:
            return None
        
        value = float(value)
        scaled = value * scaleValue
        return round(scaled, 2)

    def _getServoModel(self, modelName):
        if modelName == None:
            return

        if not KasparImporter._types.has_key(modelName.lower()):
            config = KasparImporter._configs[modelName.upper()] if KasparImporter._configs.has_key(modelName.upper()) else KasparImporter._configs['DEFAULT']
            s = ServoModel(name=modelName)
            s.minSpeed = self._realToScaleSpeed(config['MIN_SPEED'], config['SCALE_SPEED'])
            s.maxSpeed = self._realToScaleSpeed(config['MAX_SPEED'], config['SCALE_SPEED'])
            s.positionOffset = round((config['MAX_POS'] + config['MIN_POS']) / 2, 2)
            s.minPosition = self._realToScalePos(config['MIN_POS'], s.positionOffset, config['SCALE_POS'])
            s.maxPosition = self._realToScalePos(config['MAX_POS'], s.positionOffset, config['SCALE_POS'])
            s.defaultSpeed = 100
            s.defaultPosition = 0
            s.poseable = config['POSEABLE']
            s.positionScale = config['SCALE_POS']
            s.speedScale = config['SCALE_SPEED']
            KasparImporter._types[modelName.lower()] = s
        
        return KasparImporter._types[modelName.lower()]
            
    def _getServoConfigs(self):
        configs = []
        names = ['AX12', 'SSC32', 'MINISSC', 'HERKULEX']
        for name in names:
            config = self._getServoConfig(name)
            if config != None:
                configs.append(config)
        
        return configs
    
    def _getServoConfig(self, servoName):
        config = self._getSingle("%s" % servoName)
        if config == None:
            return None
        
        c = ServoConfig()
        c.port = self._getText("PORT", config, "")
        c.portSpeed = self._getText("SPEED", config, 115200)
        c.rotationOffset = 0
        c.model = self._getServoModel(servoName)
        return c

    def _getText(self, xpath, node=None, default=None):
        val = self._getSingle(xpath, node, None)
        if val != None:
            return val.text
        
        return default
        
    def _getSingle(self, xpath, node=None, default=None):
        val = self._get(xpath, node, default)
        if val != None and len(val) != 0:
            return val[0]
        
        return default
    
    def _get(self, xpath, node=None, default=None):
        if node == None:
            node = self._config
        
        try:
            nodes = node.findall(xpath)
        except Exception as e:
            print >> sys.stderr, e
            return default
        
        if len(nodes) == 0 and default != None:
            return default
    
        return nodes
    
class ActionImporter(object):
    
    def __init__(self):
        self.defaultAngle = 360.0 / 1024.0
        self.defaultSpeed = 1 / 1024.0
    
    def getPose(self, legacyData, legacyRobot=None):
        if type(legacyData) == str: 
            lines = legacyData.split('\n')
        else:
            lines = legacyData

        name = lines[0].strip()
        pose = Pose(name=name)
        
        expectedJoints = int(lines[1])
        for i in range(2, expectedJoints + 2):
            (jointName, pos, spd, _) = lines[i].strip().split(',')
            speed = int(spd)
            position = int(pos)
            
            if legacyRobot:
                try:
                    servo = filter(lambda x: x.jointName == jointName, legacyRobot.servos)[0]
                    angle = (position - (servo.positionOffset or servo.model.positionOffset)) * (servo.model.positionScale)
                    if servo.model.speedScale != None:
                        speed = speed * servo.model.speedScale
                    else:
                        speed = None
                except Exception as e:
                    print >> sys.stderr, "Servo with name %s not attached to robot %s, using default conversion" % (jointName, legacyRobot.name)
                    angle = position * self.defaultAngle
                    speed = speed * self.defaultSpeed
            else:
                angle = position * self.defaultAngle
                speed = speed * self.defaultSpeed
                
            jp = JointPosition(jointName=jointName)
            jp.angle = angle
            jp.speed = speed
            pose.jointPositions.append(jp)
            
        return pose

class TriggerImporter(object):
    
    def __init__(self):
        pass

    def getTriggers(self, legacyData, poses):
        if type(legacyData) == str: 
            lines = legacyData.split('\n')
        else:
            lines = legacyData
        
        triggers = []
        for line in lines:
            vals = line.split(',')
            if len(vals) == 2:
                name = vals[0].strip()
                key = vals[1].strip()
                try:
                    pose = filter(lambda x: x.name == name, poses)[0]
                except:
                    print >> sys.stderr, "Pose %s not found, skipping" % name
                    continue
                
                if len(key) > 1:
                    t = SensorTrigger(name=name)
                    t.sensorName = key
                    t.sensorValue = 'eval::on'
                    t.action = pose 
                    triggers.append(t)
                else:
                    t = ButtonTrigger(name=name)
                    t.action = pose
                    if len(key) == 1:
                        hk = ButtonHotKey()
                        hk.keyName = key
                        t.hotKeys.append(hk)
                    triggers.append(t)
            else:
                print >> sys.stderr, "Unknown key sequence?? %s" % line
                continue
        
        return triggers                

def loadAllConfigs():
    baseDir = os.path.dirname(os.path.realpath(__file__))
    configDir = os.path.join(baseDir, 'kasparConfigs')
    dirs = [os.path.join(configDir, o) for o in os.listdir(configDir) if os.path.isdir(os.path.join(configDir, o))]
        
    poses = []
    triggers = []
    robots = []

    a = ActionImporter()
    t = TriggerImporter()

    for subDir in dirs:        
        version = os.path.basename(subDir)
         
        k = KasparImporter(version)
        r = k.getRobot()
        robots.append(r)
        
        searchDir = os.path.join(subDir, 'pos')
        if os.path.exists(searchDir):
            files = [os.path.join(searchDir, o) for o in os.listdir(searchDir) if os.path.isfile(os.path.join(searchDir, o))]
            for fileName in files:
                f = open(fileName)
                lines = f.readlines()
                pose = a.getPose(lines, r)
                poses.append(pose)
         
        searchDir = os.path.join(subDir, 'keyMaps')
        if os.path.exists(searchDir):
            files = [os.path.join(searchDir, o) for o in os.listdir(searchDir) if os.path.isfile(os.path.join(searchDir, o))]
            for fileName in files:
                f = open(fileName)
                lines = f.readlines()
                triggers.extend(t.getTriggers(lines, poses))
    
    return (robots, poses, triggers)
