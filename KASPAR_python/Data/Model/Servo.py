from Base import StandardMixin, Base
from sqlalchemy import Column, Index, Integer, ForeignKey, Float, String, PickleType, Boolean, Table
from sqlalchemy.orm import relationship

servoGroups_table = Table('servoGroups', Base.metadata,
    Column('Servo_id', Integer, ForeignKey('Servo.id')),
    Column('ServoGroup_id', Integer, ForeignKey('ServoGroup.id'))
)

class Servo(StandardMixin, Base):
    jointName = Column(String(50))
    
    type_id = Column(Integer, ForeignKey("ServoType.id")) 
    type = relationship("ServoType")
    
    robot_id = Column(Integer, ForeignKey("Robot.id")) 
    robot = relationship("Robot", backref="servos")
    
    groups = relationship("ServoGroup", secondary=servoGroups_table, backref="servos")
    
    minSpeed = Column(Integer)
    maxSpeed = Column(Integer)
    minPosition = Column(Integer)
    maxPosition = Column(Integer)
    defaultPosition = Column(Integer)
    defaultSpeed = Column(Integer)
    poseable = Column(Boolean)
    extraData = Column(PickleType)
    
Index('robot_joints', Servo.jointName, Servo.robot_id, unique=True)

class ServoGroup(StandardMixin, Base):
    name = Column(String(50))
    
    robot_id = Column(Integer, ForeignKey("Robot.id")) 
    robot = relationship("Robot", backref="servoGroups")

    def __init__(self, name=None):
        super(ServoGroup, self).__init__()
        self.name = name

class ServoType(StandardMixin, Base):
    name = Column(String(50))
    minSpeed = Column(Integer)
    maxSpeed = Column(Integer)
    minPosition = Column(Integer)
    maxPosition = Column(Integer)
    defaultPosition = Column(Integer)
    defaultSpeed = Column(Integer)
    defaultOffset = Column(Integer)
    defaultScale = Column(Float)
    poseable = Column(Boolean)
    extraData = Column(PickleType)

    def __init__(self, name=None):
        super(ServoType, self).__init__()
        self.name = name
        
class ServoConfig(StandardMixin, Base):
    robot_id = Column(Integer, ForeignKey("Robot.id")) 
    robot = relationship("Robot", backref="servoConfigs")
    
    type_id = Column(Integer, ForeignKey("ServoType.id")) 
    type = relationship("ServoType")

    offset = Column(Float)
    scale = Column(Float)
    port = Column(String(50))
    portSpeed = Column(Integer)
    extraData = Column(PickleType)
    
    def __init__(self):
        self.offset = 0
        self.scale = 1.0