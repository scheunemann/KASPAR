from Base import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey, Table, Float, Binary
from sqlalchemy.orm import relationship
from sqlalchemy.ext.orderinglist import ordering_list

class Action(StandardMixin, Base):
    
    name = Column(String(50))
    type = Column(String(50))
    
    __mapper_args__ = {
            'polymorphic_identity':'action',
            'polymorphic_on': type
        }
        
    def __init__(self, name=None):
        super(Action, self).__init__()
        self.name = name

class Sound(Action):
    
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    data = Column(Binary)
    __mapper_args__ = {
            'polymorphic_identity':'sound',
    }    
    
    
class JointPosition(StandardMixin, Base):
    
    jointName = Column(String(50))
    angle = Column(Float)
    speed = Column(Integer)
    pose_id = Column(Integer, ForeignKey('Pose.id'))
        
    def __init__(self, jointName=None):
        super(JointPosition, self).__init__()
        self.jointName = jointName
    
    def __repr__(self):
        return "<%s('%s':%s)>" % (self.__class__.__name__, self.jointName, self.angle)

class Pose(Action):
    
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    defaultJointSpeed = Column(Integer)
    minLength = Column(Float) 
    __mapper_args__ = {
            'polymorphic_identity':'pose',
    }
                
    jointPositions = relationship("JointPosition", backref="pose")
                
class Expression(Action):
                
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'expression',
    }

class Sequence(Action):
            
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'sequence',
    }
    
    actions = relationship("OrderedAction", order_by="OrderedAction.order", collection_class=ordering_list("order"), backref="sequence")

class OrderedAction(StandardMixin, Base):
    
    order = Column(Integer)
    action_id = Column(Integer, ForeignKey('Action.id'))
    action = relationship("Action")

groupActions_table = Table('groupActions', Base.metadata,
    Column('Group_id', Integer, ForeignKey('Group.id')),
    Column('Action_id', Integer, ForeignKey('Action.id'))
)

class Group(Action):
            
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'group',
    }
    
    actions = relationship("Action", secondary=groupActions_table)
