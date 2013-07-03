from Base import StandardMixin, BaseClass
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.orderinglist import ordering_list

class Action(StandardMixin, BaseClass):
    __abstract__ = True
    name = Column(String(50))

    def __init__(self, name):
        self.name = name
    
class Sound(Action):
    
    def __init__(self, name):
        super(Sound, self).__init(name)
    
class Movement(Action):
    __abstract__ = True
    
    def __init__(self, name):
        super(Movement, self).__init(name)

class Pose(Movement):
    joints = relationship("Joint", secondary="poseJoints", backref="poses")
        
    def __init__(self, name):
        super(Pose, self).__init(name)
        
class Joint(StandardMixin, BaseClass):
    name = Column(String(50))

    def __init__(self, name):
        self.name = name
        
class Expression(Movement):
    
    def __init__(self, name):
        super(Expression, self).__init(name)

class Sequence(Action):
    
    def __init__(self, name):
        super(Sequence, self).__init(name)

class SequenceAction(StandardMixin, BaseClass):

    action_id = Column(Integer, ForeignKey("Action.id"))
    action = relationship("Action")

    sequence_id = Column(Integer, ForeignKey("Sequence.id"))
    sequence = relationship(
                           "Sequence",
                           backref=backref("actions",
                           order_by="SequenceAction.order", 
                           collection_class=ordering_list("order")))

    order = Column(Integer)

class Group(Action):
    
    def __init__(self, name):
        super(Group, self).__init(name)

class GroupAction(StandardMixin, BaseClass):
    
    action_id = Column(Integer, ForeignKey("Action.id"))
    action = relationship("Action")

    group_id = Column(Integer, ForeignKey("Group.id"))
    group = relationship("Group", backref="actions")
