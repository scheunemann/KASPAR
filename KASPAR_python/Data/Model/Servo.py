from Base import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

class Servo(StandardMixin, Base):
    joint_id = Column(Integer, ForeignKey("Joint.id")) 
    joint = relationship("Joint")
    
    type_id = Column(Integer, ForeignKey("ServoType.id")) 
    type = relationship("ServoType")
    
    robot_id = Column(Integer, ForeignKey("Robot.id")) 
    robot = relationship("Robot", backref="servos")
    
    group_id = Column(Integer, ForeignKey("ServoGroup.id")) 
    group = relationship("ServoGroup", backref="servos")

class ServoGroup(StandardMixin, Base):
    name = Column(String(50))

    def __init__(self, name=None):
        super(ServoGroup, self).__init__()
        self.name = name
        
class ServoType(StandardMixin, Base):
    name = Column(String(50))

    def __init__(self, name=None, version=None):
        super(ServoType, self).__init__()
        self.name = name
        self.version = version
        
class ServoConfig(StandardMixin, Base):
    robot_id = Column(Integer, ForeignKey("Robot.id")) 
    robot = relationship("Robot", backref="servoConfigs")
    
    type_id = Column(Integer, ForeignKey("ServoType.id")) 
    type = relationship("ServoType")
