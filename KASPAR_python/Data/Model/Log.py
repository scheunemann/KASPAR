from Base import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship

class Log(StandardMixin, Base):
    
    type = Column(String(50))
    
    __mapper_args__ = {
            'polymorphic_identity':'trigger',
            'polymorphic_on': type
        }
    
    def __init__(self, name):
        super(Log, self).__init__()

class DebugLog(Log):
    
    id = Column(Integer, ForeignKey('%s.id' % 'Log'), primary_key=True)
    data = Column(String(5000))
    
    __mapper_args__ = {
            'polymorphic_identity':'debug',
    }
    
    def __init__(self, name):
        super(DebugLog, self).__init__()

class InteractionLog(Log):
    
    id = Column(Integer, ForeignKey('%s.id' % 'Log'), primary_key=True)
    interaction_id = Column(Integer, ForeignKey('Interaction.id'))
    interaction = relationship("Interaction")
    
    __mapper_args__ = {
            'polymorphic_identity':'interaction',
    }
    
    def __init__(self, name):
        super(InteractionLog, self).__init__()

interactionUsers_table = Table('interactionUsers', Base.metadata,
    Column('Interaction_id', Integer, ForeignKey('Interaction.id')),
    Column('User_id', Integer, ForeignKey('User.id'))
)

class Interaction(StandardMixin, Base):
    
    users = relationship("User", secondary=interactionUsers_table)
    operator_id = Column(Integer, ForeignKey('Operator.id'))
    operator = relationship("Operator")
    
    def __init__(self, name):
        super(Interaction, self).__init__()
