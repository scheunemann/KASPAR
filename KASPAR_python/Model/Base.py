from sqlalchemy.ext.declarative import declared_attr, declarative_base
from sqlalchemy import Column, Integer, Sequence

BaseClass = declarative_base()

class TableMixin(object):

    @declared_attr
    def __tablename__(cls):
        return cls.__name__
    
    __table_args__ = {'mysql_engine': 'InnoDB'}
    id = Column(Integer, Sequence('%s_id_seq' % __tablename__), primary_key=True)

class SettingMixin(object):

    __mapper_args__= {'always_refresh': True}

class DisplayMixin(object):
    
    def __repr__(self):
        return "<%s('%s')>" % (self.__class__.__name__, self.name)

class StandardMixin(TableMixin, DisplayMixin, SettingMixin):
    pass