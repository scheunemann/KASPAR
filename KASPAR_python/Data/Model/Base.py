from sqlalchemy.ext.declarative import declared_attr, declarative_base
from sqlalchemy import inspect, Column, Integer, Sequence, DateTime, func
from sqlalchemy.orm.properties import RelationshipProperty, ColumnProperty
from sqlalchemy.sql.expression import Join

class Base(object):

    @declared_attr
    def __tablename__(cls):
        return cls.__name__
    
    __table_args__ = {'mysql_engine': 'InnoDB'}
    
    id = Column(Integer, Sequence('%s_id_seq' % __tablename__), primary_key=True)
    created = Column(DateTime, nullable=False, default=func.now()) 
    modified = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    @staticmethod
    def getDesc(cls):
        desc = {}
        mapper = inspect(cls)
        for attr in mapper.attrs:
            if isinstance(attr, RelationshipProperty):
                if attr.uselist == True:
                    try:
                        desc[attr.key] = "[%s]" % attr.mapper.class_.__name__
                    except:
                        print type(attr.target)
                        print dir(attr.target)
                else:
                    desc[attr.key] = attr.mapper.class_.__name__
            elif isinstance(attr, ColumnProperty):
                desc[attr.key] = attr.columns[0].type.python_type
        
        return desc

Base = declarative_base(cls=Base)

class SettingMixin(object):

    __mapper_args__= {'always_refresh': True}

class DisplayMixin(object):
    
    def __repr__(self):
        return "<%s('%s')>" % (self.__class__.__name__, self.name)
    
class StandardMixin(DisplayMixin, SettingMixin):
    pass
