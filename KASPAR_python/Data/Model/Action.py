from Base import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.orderinglist import ordering_list

class Action(StandardMixin, Base):
    
    name = Column(String(50))
    type = Column(String(50))
    
    __mapper_args__ = {
            'polymorphic_identity':'action',
            'polymorphic_on': type
        }
        
    def __init__(self, name):
        self.name = name
    
class Sound(Action):
    
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'sound',
    }
        
    def __init__(self, name):
        super(Sound, self).__init(name)
    
class Movement(Action):
    __abstract__ = True
        
    def __init__(self, name):
        super(Movement, self).__init(name)

poseJoints_table = Table('poseJoints', Base.metadata,
    Column('Pose_id', Integer, ForeignKey('Pose.id')),
    Column('Joint_id', Integer, ForeignKey('Joint.id'))
)

class Pose(Movement):
    
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'pose',
    }
                
    joints = relationship("Joint", secondary=poseJoints_table, backref="poses")
    
    def __init__(self, name):
        super(Pose, self).__init(name)
                
class Expression(Movement):
                
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'expression',
    }
    
    def __init__(self, name):
        super(Expression, self).__init(name)

class Sequence(Action):
            
    id = Column(Integer, ForeignKey('%s.id' % 'Action'), primary_key=True)
    __mapper_args__ = {
            'polymorphic_identity':'sequence',
    }
    
    actions = relationship("OrderedAction", order_by="OrderedAction.order", collection_class=ordering_list("order"), backref="sequence")
        
    def __init__(self, name):
        super(Sequence, self).__init(name)
    

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
        
    def __init__(self, name):
        super(Group, self).__init(name)
