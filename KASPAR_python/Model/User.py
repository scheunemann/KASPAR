from Base import StandardMixin, BaseClass
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from Model.Trigger import Trigger
from Model.Action import Action

class User(StandardMixin, BaseClass):
    name = Column(String(50))
    fullname = Column(String(50))

    def __init__(self, name, fullname):
        self.name = name
        self.fullname = fullname

class CustomTrigger(Trigger):
    user = relationship("User", backref="customTriggers")
    
    def __init__(self):
        pass

class CustomAction(Action):
    user = relationship("User", backref="customActions")

    def __init__(self):
        pass