from Base import StandardMixin, BaseClass
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

class Sensor(StandardMixin, BaseClass):
    type = relationship("SensorType")
    robot = relationship("Robot", backref="sensors")
    group = relationship("SensorGroup", backref="sensors")

    def __init__(self):
        pass

class SensorGroup(StandardMixin, BaseClass):
    name = Column(String(50))

    def __init__(self, name):
        self.name = name
        
class SensorType(StandardMixin, BaseClass):
    name = Column(String(50))

    def __init__(self, name, version):
        self.name = name
        self.version = version
        
class SensorConfig(StandardMixin, BaseClass):
    robot = relationship("Robot", backref="sensorConfigs")
    type = relationship("SensorType")

    def __init__(self):
        pass
    