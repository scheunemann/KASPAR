import os, sys
from xml.etree import ElementTree as et
from Data.Model import Robot, Servo, ServoGroup, ServoType, ServoConfig, Pose, JointPosition, SensorTrigger, ButtonTrigger, ButtonHotKey

class KasparImporter(object):
    def __init__(self, version):
        if version.lower() == 'kaspar1a':
            fileName = 'kasparConfigs/Kaspar1a.xml'
            self._version = 'KASPAR1a'
        elif version.lower() == 'kaspar1b':
            fileName = 'kasparConfigs/Kaspar1b.xml'
            self._version = 'KASPAR1b'
        elif version.lower() == 'kaspar1c':
            fileName = 'kasparConfigs/Kaspar1c.xml'
            self._version = 'KASPAR1c'
        elif version.lower() == 'kaspar3a':
            fileName = 'kasparConfigs/Kaspar3a.xml'
            self._version = 'KASPAR3a'
        else:
            raise Exception('Unknown version %s' % version)
        
        self._types = {}
        self._config = et.parse(os.path.join(os.path.dirname(os.path.realpath(__file__)), fileName)).getroot()
    
    def getRobot(self):
        r = Robot(name=self._getText('NAME', None, 'KASPAR'), version=self._version)
        r.servoGroups = self._getServoGroups()
        r.servos = self._getServos(r.servoGroups)
        r.servoConfigs = self._getServoConfigs()
        
        return r
    
    def _getServos(self, servoGroups):
        servos = []
        for servo in self._get("SERVOLIST/SERVO"):
            s = Servo()
            s.jointName = self._getText("NAME", servo)
            s.type = self._getServoType(servo.get('type', None))
            s.minPosition = self._convert(self._getText("LIMITS[@type='pos']/MIN", servo))
            s.maxPosition = self._convert(self._getText("LIMITS[@type='pos']/MAX", servo))
            s.defaultPosition = self._convert(self._getText("DEFAULT/POS", servo))
            s.minSpeed = self._convert(self._getText("LIMITS[@type='speed']/MIN", servo))
            s.maxSpeed = self._convert(self._getText("LIMITS[@type='speed']/MAX", servo))
            s.extraData = {'externalId': int(servo.get('id', -1))}
            if s.minSpeed > s.maxSpeed:
                temp = s.minSpeed
                s.minSpeed = s.maxSpeed
                s.maxSpeed = temp
            
            s.defaultSpeed = self._convert(self._getText("DEFAULT/SPEED", servo))
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
    
    def _convert(self, value):
        if value == None:
            return None
        
        return round((360.0 / 1024) * (int(value) % 1024), 2)
    
    def _getServoType(self, typeName):
        if typeName == None:
            return
        
        if not self._types.has_key(typeName.lower()):
            s = ServoType(name=typeName)
            s.minSpeed = 0
            s.maxSpeed = 100
            s.minPosition = 0
            s.maxPosition = 360
            s.defaultSpeed = 50
            s.defaultPosition = 180
            s.poseable = typeName.lower() == 'AX12'
            s.offset = 0
            s.scale = 1024.0 / 360.0
            self._types[typeName.lower()] = s
        
        return self._types[typeName.lower()]
            
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
        c.rotationScale = 360 / 1024.0
        c.speedScale = 1 / 1024.0
        c.type = self._getServoType(servoName)
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
                    servoConfig = filter(lambda x: x.type == servo.type, legacyRobot.servoConfigs)[0]
                    angle = (position - servoConfig.rotationOffset) * (servoConfig.rotationScale)
                    speed = speed * servoConfig.speedScale
                except:
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

if __name__ == '__main__':
    k = KasparImporter('kaspar1a')
    r = k.getRobot()
    a = ActionImporter()
    t = TriggerImporter()
    
    poses = []
    triggers = []
    
    baseDir = os.path.dirname(os.path.realpath(__file__))
    searchDir = os.path.join(baseDir, 'kasparConfigs/kaspar1a/pos')
    for fileName in os.listdir(searchDir):
        f = open(os.path.join(searchDir, fileName))
        lines = f.readlines()
        poses.append(a.getPose(lines, r))
    
    searchDir = os.path.join(baseDir, 'kasparConfigs/kaspar1a/keyMaps')
    for fileName in os.listdir(searchDir):
        f = open(os.path.join(searchDir, fileName))
        lines = f.readlines()
        triggers.extend(t.getTriggers(lines, poses))

    print r
    print poses
    print triggers
