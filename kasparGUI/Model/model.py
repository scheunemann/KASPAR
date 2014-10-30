import os
import uuid
from robotActionController.Data.Model import StandardMixin, Base, User
from sqlalchemy import Column, String, Integer, ForeignKey, Table, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import func


__all__ = ['Game', 'Interaction', 'InteractionGame', 'InteractionUser', 'Note', 'Objective', 'Operator', 'Photo', 'Setting', 'Tag']

operatorUsers_table = Table('operatorUsers', Base.metadata,
    Column('Operator_id', Integer, ForeignKey('Operator.id')),
    Column('User_id', Integer, ForeignKey('User.id'))
)

operatorGames_table = Table('operatorGames', Base.metadata,
    Column('Operator_id', Integer, ForeignKey('Operator.id')),
    Column('Game_id', Integer, ForeignKey('Game.id'))
)

userObjectives_table = Table('userObjectives', Base.metadata,
    Column('User_id', Integer, ForeignKey('User.id')),
    Column('Objective_id', Integer, ForeignKey('Objective.id'))
)

userNotes_table = Table('userNotes', Base.metadata,
    Column('InteractionUser_id', Integer, ForeignKey('InteractionUser.id')),
    Column('Note_id', Integer, ForeignKey('Note.id'))
)

interactionNotes_table = Table('interactionNotes', Base.metadata,
    Column('Interaction_id', Integer, ForeignKey('Interaction.id')),
    Column('Note_id', Integer, ForeignKey('Note.id'))
)

gameTriggers_table = Table('gameTriggers', Base.metadata,
    Column('Game_id', Integer, ForeignKey('Game.id')),
    Column('Trigger_id', Integer, ForeignKey('Trigger.id'))
)

gameObjectives_table = Table('gameObjectives', Base.metadata,
    Column('Game_id', Integer, ForeignKey('Game.id')),
    Column('Objective_id', Integer, ForeignKey('Objective.id'))
)

gameTags_table = Table('gameTags', Base.metadata,
    Column('Game_id', Integer, ForeignKey('Game.id')),
    Column('Tag_id', Integer, ForeignKey('Tag.id'))
)


class Photo(StandardMixin, Base):

    uuid = Column(String(36))

    @property
    def data(self):
        return Photo.readData(self.uuid)

    @data.setter
    def data(self, value):
        self.uuid = Photo.saveData(value, self.uuid)

    @property
    def _fileName(self):
        self.uuid, path = Photo.__fileName(self.uuid)
        return path

    @staticmethod
    def saveData(value, uuid=None):
        if value:
            uuid, fileName = Photo.__fileName(uuid)
            with open(fileName, 'wb') as f:
                f.write(value)
        elif uuid != None:
            os.remove(fileName)
            uuid = None
        return uuid

    @staticmethod
    def readData(uuid=None):
        if not uuid:
            return None
        fileName = Photo.__fileName(uuid)[1]
        if os.path.isfile(fileName):
            with open(fileName, 'rb') as f:
                b = f.read()
            return b
        else:
            return None

    @staticmethod
    def __fileName(uuid_=None):
        basePath = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'profilePhotos'))
        if not os.path.isdir(basePath):
            os.makedirs(basePath)

        if uuid_ == None:
            uuid_ = str(uuid.uuid1())

        return (uuid_, os.path.join(basePath, uuid_))


class Setting(StandardMixin, Base):

    key = Column('Key', String(500))
    value = Column('Value', String(500))

    def __init__(self, key=None, value=None, **kwargs):
        super(Setting, self).__init__(**kwargs)
        self.key = key
        self.value = value


class Interaction(StandardMixin, Base):

    users = relationship("InteractionUser", back_populates="interaction")

    robot_id = Column(Integer, ForeignKey('Robot.id'))
    robot = relationship("Robot")

    operator_id = Column(Integer, ForeignKey('Operator.id'))
    operator = relationship("Operator")
    operatorExperience = Column(Integer)

    startTime = Column(DateTime, nullable=False)
    endTime = Column(DateTime)

    games = relationship("InteractionGame", back_populates="interaction")

    notes = relationship("Note", secondary=interactionNotes_table)

    def __init__(self, users=[], robot_id=None, robot=None, operator_id=None, operator=None, startTime=None, endTime=None, games=[], operatorExperience=None, notes=[], **kwargs):
        super(Interaction, self).__init__(**kwargs)
        self.users = users
        self.robot_id = robot_id
        self.robot = robot
        self.operator_id = operator_id
        self.operator = operator
        self.startTime = startTime
        self.endTime = endTime
        self.games = games
        self.operatorExperience = operatorExperience
        self.notes = notes


class InteractionUser(StandardMixin, Base):

    interaction_id = Column(Integer, ForeignKey("Interaction.id"))
    interaction = relationship("Interaction", back_populates="users")

    user_id = Column(Integer, ForeignKey("User.id"))
    user = relationship("User", back_populates="interactions")

    engagement = Column(Integer)
    experience = Column(Integer)

    notes = relationship("Note", secondary=userNotes_table)

    def __init__(self, user=None, interaction=None, **kwargs):
        super(InteractionUser, self).__init__(**kwargs)
        self.user = user
        self.interaction = interaction


class InteractionGame(StandardMixin, Base):

    interaction_id = Column(Integer, ForeignKey("Interaction.id"))
    interaction = relationship("Interaction", back_populates="games")

    game_id = Column(Integer, ForeignKey("Game.id"))
    game = relationship("Game")

    startTime = Column(DateTime)
    endTime = Column(DateTime)

    def __init__(self, game=None, startTime=None, endTime=None, interaction=None, **kwargs):
        super(InteractionGame, self).__init__(**kwargs)
        self.game = game
        self.startTime = startTime
        self.endTime = endTime
        self.interaction = interaction


class Note(StandardMixin, Base):

    title = Column(String(50))
    text = Column(String(5000))

    created = Column(DateTime, nullable=False, default=func.now())
    modified = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    def __init__(self, title=None, text=None, interaction=None, **kwargs):
        super(Note, self).__init__(**kwargs)
        self.title = title
        self.text = text
        self.interaction = interaction


class Operator(StandardMixin, Base):

    name = Column(String(50))
    fullname = Column(String(50))
    password = Column(String(500))

    users = relationship("User", secondary=operatorUsers_table)
    favoriteGames = relationship("Game", secondary=operatorGames_table)

    def __init__(self, name=None, fullname=None, password=None, users=[], **kwargs):
        super(Operator, self).__init__(**kwargs)
        self.name = name
        self.fullname = fullname
        self.password = password
        self.users = users


class Game(StandardMixin, Base):

    name = Column(String(50))
    desc = Column(String(5000))
    author = relationship("Operator")
    author_id = Column(Integer, ForeignKey('Operator.id'))
    photo = relationship("Photo")
    photo_id = Column(Integer, ForeignKey('Photo.id'))
    objectives = relationship("Objective", secondary=gameObjectives_table)
    tags = relationship("Tag", secondary=gameTags_table)
    triggers = relationship("Trigger", secondary=gameTriggers_table)

    def __init__(self, name=None, desc=None, photo=None, triggers=[], **kwargs):
        super(Game, self).__init__(**kwargs)
        self.name = name
        self.desc = desc
        self.photo = photo
        self.triggers = triggers


class Objective(StandardMixin, Base):

    name = Column(String(50))
    desc = Column(String(500))

    def __init__(self, name=None, desc=None, **kwargs):
        super(Objective, self).__init__(**kwargs)
        self.name = name
        self.desc = desc


class Tag(StandardMixin, Base):

    name = Column(String(50))
    desc = Column(String(500))

    def __init__(self, name=None, desc=None, **kwargs):
        super(Objective, self).__init__(**kwargs)
        self.name = name
        self.desc = desc


User.objectives = relationship("Objective", secondary=userObjectives_table)
User.interactions = relationship("InteractionUser", back_populates="user")
User.gender = Column(String(1), nullable=True)
User.birthday = Column(Date, nullable=True)
User.photo_id = Column(Integer, ForeignKey('Photo.id'))
User.photo = relationship("Photo")
