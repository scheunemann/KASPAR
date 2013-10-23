from Base import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

class Sensor(StandardMixin, Base):
    
    type_id = Column(Integer, ForeignKey("SensorType.id")) 
    type = relationship("SensorType")
    
    robot_id = Column(Integer, ForeignKey("Robot.id"))
    robot = relationship("Robot", backref="sensors")
    
    group_id = Column(Integer, ForeignKey("SensorGroup.id"))
    group = relationship("SensorGroup", backref="sensors")

class SensorGroup(StandardMixin, Base):
    name = Column(String(50))

    def __init__(self, name=None):
        super(SensorGroup, self).__init__()
        self.name = name
        
class SensorType(StandardMixin, Base):
    name = Column(String(50))

    def __init__(self, name=None, version=None):
        super(SensorType, self).__init__()
        self.name = name
        self.version = version
        
class SensorConfig(StandardMixin, Base):
    
    robot_id = Column(Integer, ForeignKey("Robot.id"))
    robot = relationship("Robot", backref="sensorConfigs")
    
    type_id = Column(Integer, ForeignKey("SensorType.id")) 
    type = relationship("SensorType")
