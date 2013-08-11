from sqlalchemy.ext.declarative import declared_attr, declarative_base
from sqlalchemy import inspect, Column, Integer, Sequence, DateTime, func
from sqlalchemy.orm.properties import RelationshipProperty, ColumnProperty
from sqlalchemy.orm import Session
from dateutil.tz import tzutc
import Data.Storage
import Data.config
import datetime

class Base(Data.config.modelBase):

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
    
    @staticmethod
    def _utcDateTime(dt):
        if dt.tzinfo:
            dt = dt.astimezone(tzutc()).replace(tzinfo=None)
        return dt.isoformat() + 'Z'
    
    @staticmethod
    def deserialize(cls, dictObj, session):
        mapper = inspect(cls)
        newObj = cls()
        for attr in mapper.attrs:
            if not dictObj.has_key(attr.key):
                continue;
            
            if isinstance(attr, RelationshipProperty):
                itemType = attr.mapper.class_
                if attr.uselist == True:
                    attrList = getattr(newObj, attr.key)
                    objIds = dictObj[attr.key]
                    for o in objIds:
                        attrList.append(session.query(itemType).get(o))
                else:
                    setattr(newObj, attr.key, session.query(itemType).get(o))
            elif isinstance(attr, ColumnProperty):
                if attr.columns[0].type.python_type == datetime.datetime:
                    item = datetime.datetime.strptime(dictObj[attr.key], '%Y-%m-%dT%H:%M:%SZ')
                else:
                    item = dictObj[attr.key]
                
                setattr(newObj, attr.key, item)

        return newObj
    
    def serialize(self):
        mapper = inspect(self.__class__)
        obj = {}
        for attr in mapper.attrs:
            if isinstance(attr, RelationshipProperty):
                if attr.uselist == True:
                    ids = []
                    for item in getattr(self, attr.key):
                        ids.append(item.id)
                    
                    obj[attr.key] = ids
                else:
                    obj[attr.key] = getattr(self, attr.key).id
            elif isinstance(attr, ColumnProperty):
                item = getattr(self, attr.key)
                if type(item) == datetime.datetime:
                    item = Base._utcDateTime(item)
                    
                obj[attr.key] = item                

        return obj

Base = declarative_base(cls=Base)

class SettingMixin(object):

    __mapper_args__= {'always_refresh': True}

class DisplayMixin(object):
    
    def __repr__(self):
        return "<%s('%s')>" % (self.__class__.__name__, self.name)
    
class StandardMixin(DisplayMixin, SettingMixin):
    pass
