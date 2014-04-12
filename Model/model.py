from Data.Model import StandardMixin, Base
from sqlalchemy import Column, String, Integer, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship

__all__ = ['Setting', 'Interaction', 'Operator']


class Setting(StandardMixin, Base):

    key = Column('Key', String(500))
    value = Column('Value', String(500))

    def __init__(self, key=None, value=None, **kwargs):
        super(Setting, self).__init__(**kwargs)
        self.key = key
        self.value = value


interactionUsers_table = Table('interactionUsers', Base.metadata,
    Column('Interaction_id', Integer, ForeignKey('Interaction.id')),
    Column('User_id', Integer, ForeignKey('User.id'))
)


class Interaction(StandardMixin, Base):

    users = relationship("User", secondary=interactionUsers_table)
    robot_id = Column(Integer, ForeignKey('Robot.id'))
    robot = relationship("Robot")
    operator_id = Column(Integer, ForeignKey('Operator.id'))
    operator = relationship("Operator")
    startTime = Column(DateTime, nullable=False)
    endTime = Column(DateTime)

    def __init__(self, users=None, robot_id=None, robot=None, operator_id=None, operator=None, startTime=None, endTime=None, **kwargs):
        super(Interaction, self).__init__(**kwargs)
        self.users = users
        self.robot_id = robot_id
        self.robot = robot
        self.operator_id = operator_id
        self.operator = operator
        self.startTime = startTime
        self.endTime = endTime

operatorUsers_table = Table('operatorUsers', Base.metadata,
    Column('Operator_id', Integer, ForeignKey('Operator.id')),
    Column('User_id', Integer, ForeignKey('User.id'))
)


class Operator(StandardMixin, Base):
    name = Column(String(50))
    fullname = Column(String(50))
    password = Column(String(500))
    users = relationship("User", secondary=operatorUsers_table)

    def __init__(self, name=None, fullname=None, password=None, users=None, **kwargs):
        super(Operator, self).__init__(**kwargs)
        self.name = name
        self.fullname = fullname
        self.password = password
        self.users = users
