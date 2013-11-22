from Data.Model import Base
from Data.storage import StorageFactory


def _flushAndFillTestData():
    from config import dbConfig
    StorageFactory.config['engine'].update(dbConfig)
#     StorageFactory.config['debug'] = True
    StorageFactory.drop_keys(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.drop_all(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.create_all(StorageFactory.getDefaultDataStore().engine)

    from Data.Model import Operator, User
    from Config.legacy import loadAllConfigs
    o = Operator('oNathan', 'oNathan Burke')
    o.password = '1234'

    u = User('uNathan', 'uNathan Burke')
    o.users.append(u)

    (robots, poses, triggers) = loadAllConfigs()

    session = StorageFactory.getNewSession()
    with session.begin():
        session.add_all(robots)
        session.add_all(poses)
        session.add_all(triggers)
        session.add(o)

if __name__ == "__main__":
    _flushAndFillTestData()
