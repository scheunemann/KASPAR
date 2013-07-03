from Base import StandardMixin, BaseClass
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

class Servo(StandardMixin, BaseClass):
    joint = relationship("Joint")
    type = relationship("ServoType")
    robot = relationship("Robot", backref="servos")
    group = relationship("ServoGroup", backref="servos")

    def __init__(self):
        pass

class ServoGroup(StandardMixin, BaseClass):
    name = Column(String(50))

    def __init__(self, name):
        self.name = name
        
class ServoType(StandardMixin, BaseClass):
    name = Column(String(50))

    def __init__(self, name, version):
        self.name = name
        self.version = version
        
class ServoConfig(StandardMixin, BaseClass):
    robot = relationship("Robot", backref="servoConfigs")
    type = relationship("ServoType")

    def __init__(self):
        pass
    