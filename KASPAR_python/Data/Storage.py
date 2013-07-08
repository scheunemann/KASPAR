from sqlalchemy import create_engine
from config import database_config

class StorageFactory(object):

    _dataStore = None

    @staticmethod
    def getDefaultDataStore():
        if StorageFactory._dataStore == None:
            StorageFactory._dataStore = StorageFactory._buildDataStore(database_config['engine']['type'])
            
        return StorageFactory._dataStore 
    
    @staticmethod
    def _buildDataStore(dbtype):
        if dbtype == 'MySql':
            return MySQLDataStore(database_config['engine']['host'], database_config['engine']['user'], database_config['engine']['pass'], database_config['engine']['db'])
        elif dbtype == 'Sqlite':
            pass
    
class DataStore(object):
    
    def __init__(self, uri, debug=False):
        self._engine = create_engine(uri, echo=debug)
    
    @property
    def engine(self):
        return self._engine
    
class MySQLDataStore(DataStore):
    
    def __init__(self, host, user, pw, db):
        #uri = "mysql://anonymous@%(host)s/%(db)s"
        uri = "mysql://%(user)s:%(pass)s@%(host)s/%(db)s" % {
                                                             'user': user,
                                                             'pass': pw,
                                                             'host': host,
                                                             'db': db }
        
        super(MySQLDataStore, self).__init__(uri, database_config['debug'])
        
if __name__ == '__main__':
    e = StorageFactory.getDefaultDataStore().engine
    from Model import Base
    Base.metadata.drop_all(e)
    Base.metadata.create_all(e)
    