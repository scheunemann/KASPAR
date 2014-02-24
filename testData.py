import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../robotActionController')))

from Config.config import dbConfig
from Model import Base, User, Operator
from Data.storage import StorageFactory
from Robot import importer


def _flushAndFillTestData():
    StorageFactory.config['engine'].update(dbConfig)
    StorageFactory.config['debug'] = True
    StorageFactory.drop_keys(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.drop_all(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.create_all(StorageFactory.getDefaultDataStore().engine)

    o = Operator('oNathan', 'oNathan Burke')
    o.password = '1234'

    u = User('uNathan', 'uNathan Burke')
    o.users.append(u)

    baseDir = os.path.dirname(os.path.realpath(__file__))
    configDir = os.path.join(baseDir, 'Config/kasparConfigs')
    print "Loading configs..."
    (robots, actions, triggers) = importer.loadAllDirectories(configDir)
    print "Done."

    session = StorageFactory.getNewSession()
    for sound in [a for a in actions if a.type == 'Sound']:
        session.add(sound)

    session.add_all(robots)
    session.add_all(actions)
    session.add_all(triggers)
    session.add(o)
    session.commit()
    session.close()

if __name__ == "__main__":
    _flushAndFillTestData()
