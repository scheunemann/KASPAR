from Data.Model import *
from base import ServiceBase

class Admin(ServiceBase):
    exposed = True
    _objects = [Operator, User, Robot]

class Behaviours(ServiceBase):
    exposed = True
    _objects = [Action]

class Trigger(ServiceBase):
    exposed = True
    _objects = [SensorTrigger, TimeTrigger, ButtonTrigger]

class Interactions(ServiceBase):
    exposed = True
    _objects = [Interaction]
