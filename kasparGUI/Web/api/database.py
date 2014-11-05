from sqlalchemy.orm import scoped_session
from robotActionController.Data.storage import StorageFactory
from kasparGUI.Config.config import dbConfig, globalConfig
StorageFactory.config['engine'].update(dbConfig)
StorageFactory.config['debug'] = False
StorageFactory.config['dataFolder'] = globalConfig['dataFolder']

db_session = scoped_session(StorageFactory.getNewSession())
