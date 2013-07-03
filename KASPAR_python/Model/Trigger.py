from Base import StandardMixin, BaseClass
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

class Trigger(StandardMixin, BaseClass):
    __abstract__ = True
    name = Column(String(50))
    action = relationship("Action", backref="triggers")

    def __init__(self, name):
        self.name = name
    
class Sensor(Trigger):
    
    def __init__(self, name):
        super(Sensor, self).__init(name)
    
class Time(Trigger):
        
    def __init__(self, name):
        super(Time, self).__init(name)

class Button(Trigger):
        
    def __init__(self, name):
        super(Button, self).__init(name)
