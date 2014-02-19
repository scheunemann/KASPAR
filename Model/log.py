from Data.Model import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

__all__ = ['Log', 'DebugLog', 'InteractionLog']


class Log(StandardMixin, Base):

    type = Column(String(50))

    __mapper_args__ = {
            'polymorphic_identity': 'trigger',
            'polymorphic_on': type
        }

    def __init__(self, type_=None):
        super(Log, self).__init__()
        self.type = type_


class DebugLog(Log):

    id = Column(Integer, ForeignKey('%s.id' % 'Log'), primary_key=True)
    data = Column(String(5000))

    __mapper_args__ = {
            'polymorphic_identity': 'debug',
    }


class InteractionLog(Log):

    id = Column(Integer, ForeignKey('%s.id' % 'Log'), primary_key=True)
    interaction_id = Column(Integer, ForeignKey('Interaction.id'))
    interaction = relationship("Interaction")

    __mapper_args__ = {
            'polymorphic_identity': 'interaction',
    }

    trigger_id = Column(Integer, ForeignKey('Trigger.id'))
    trigger = relationship("Trigger")
