from Base import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
import Trigger
import Action

class User(StandardMixin, Base):
    name = Column(String(50))
    fullname = Column(String(50))

    def __init__(self, name, fullname):
        self.name = name
        self.fullname = fullname

class CustomTrigger(Trigger.Trigger):
    
    id = Column(Integer, ForeignKey('%s.id' % 'Trigger'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'userCustom',
    }
    
    user_id = Column(Integer, ForeignKey('User.id'))
    user = relationship("User", backref="customTriggers")
    
    def __init__(self, name):
        super(CustomTrigger, self).__init(name)

class CustomAction(Action.Action):
    
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'userCustom',
    }
    
    user_id = Column(Integer, ForeignKey('User.id'))
    user = relationship("User", backref="customActions")

    def __init__(self, name):
        super(CustomAction, self).__init(name)