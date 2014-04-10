from sqlalchemy.orm import scoped_session
from Data.storage import StorageFactory
from Config.config import dbConfig
StorageFactory.config['engine'].update(dbConfig)
StorageFactory.config['debug'] = False

db_session = scoped_session(StorageFactory.getNewSession())