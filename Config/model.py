from Data.Model import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship


class Setting(StandardMixin, Base):

    key = Column('Key', String(500))
    value = Column('Value', String(500))


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

    sensor_id = Column(Integer, ForeignKey('Sensor.id'))
    sensor = relationship("Sensor")

interactionUsers_table = Table('interactionUsers', Base.metadata,
    Column('Interaction_id', Integer, ForeignKey('Interaction.id')),
    Column('User_id', Integer, ForeignKey('User.id'))
)


class Interaction(StandardMixin, Base):

    users = relationship("User", secondary=interactionUsers_table)
    operator_id = Column(Integer, ForeignKey('Operator.id'))
    operator = relationship("Operator")
    startTime = Column(DateTime, nullable=False)
    endTime = Column(DateTime)

operatorUsers_table = Table('operatorUsers', Base.metadata,
    Column('Operator_id', Integer, ForeignKey('Operator.id')),
    Column('User_id', Integer, ForeignKey('User.id'))
)


class Operator(StandardMixin, Base):
    name = Column(String(50))
    fullname = Column(String(50))
    password = Column(String(500))
    users = relationship("User", secondary=operatorUsers_table)

    def __init__(self, name=None, fullname=None):
        super(Operator, self).__init__()
        self.name = name
        self.fullname = fullname
