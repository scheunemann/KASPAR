from robotActionController.Data.Model import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Table, func
from sqlalchemy.orm import relationship

__all__ = ['Log', 'DebugLog', 'InteractionLog']


class Log(StandardMixin, Base):

    type = Column(String(50))
    timestamp = Column(DateTime, nullable=False, default=func.now())

    __mapper_args__ = {
            'polymorphic_identity': 'trigger',
            'polymorphic_on': type
        }

    def __init__(self, timestamp=None, **kwargs):
        super(Log, self).__init__(**kwargs)
        self.timestamp = timestamp


class DebugLog(Log):

    id = Column(Integer, ForeignKey('%s.id' % 'Log'), primary_key=True)
    data = Column(String(5000))

    __mapper_args__ = {
            'polymorphic_identity': 'debug',
    }

    def __init__(self, data=None, **kwargs):
        super(DebugLog, self).__init__(**kwargs)
        self.data = data


interactionDebugLog_table = Table('interactionDebugLog', Base.metadata,
    Column('DebugLog_id', Integer, ForeignKey('DebugLog.id')),
    Column('InteractionLog_id', Integer, ForeignKey('InteractionLog.id'))
)


class InteractionLog(Log):

    id = Column(Integer, ForeignKey('%s.id' % 'Log'), primary_key=True)
    interaction_id = Column(Integer, ForeignKey('Interaction.id'))
    interaction = relationship("Interaction")

    __mapper_args__ = {
            'polymorphic_identity': 'interaction',
    }

    trigger_id = Column(Integer, ForeignKey('Trigger.id'))
    trigger = relationship("Trigger")

    logs = relationship("DebugLog", secondary=interactionDebugLog_table)

    finished = Column(DateTime, nullable=True)

    def __init__(self, interaction_id=None, interaction=None, trigger_id=None, trigger=None, logs=[], finished=None, **kwargs):
        super(InteractionLog, self).__init__(**kwargs)
        self.interaction_id = interaction_id
        self.interaction = interaction
        self.trigger_id = trigger_id
        self.trigger = trigger
        self.logs = logs
        self.finished = finished
