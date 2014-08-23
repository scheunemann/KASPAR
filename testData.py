import os
import datetime
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../robotActionController')))

from Config.config import dbConfig
from Model import Base, User, Operator, Interaction, Setting
from Data.storage import StorageFactory
from Robot import importer


def _flushAndFillTestData(configDir, flush=True):
    StorageFactory.config['engine'].update(dbConfig)
    StorageFactory.config['debug'] = True
    if flush:
        StorageFactory.drop_keys(StorageFactory.getDefaultDataStore().engine)
        Base.metadata.drop_all(StorageFactory.getDefaultDataStore().engine)
        Base.metadata.create_all(StorageFactory.getDefaultDataStore().engine)

    operators = [
                    Operator('Operator1', 'Test Operator 1'),
                    Operator('Operator2', 'Test Operator 2'),
                 ]

    users = [
             User('User1', 'Test User 1'),
             User('User2', 'Test User 2'),
             User('User3', 'Test User 3'),
             User('User4', 'Test User 4'),
             User('User5', 'Test User 5'),
             User('User6', 'Test User 6'),
             User('User7', 'Test User 7'),
             User('User8', 'Test User 8'),
             User('User9', 'Test User 9'),
             User('User0', 'Test User 10'),
             User('User11', 'Test User 11'),
             User('User12', 'Test User 12'),
             User('User13', 'Test User 13'),
             User('User14', 'Test User 14'),
             ]

    operators[0].users.extend(users[1:3])

    print "Loading configs..."
    (robots, actions, triggers) = importer.loadDirectory({}, {}, [], configDir)
    print "Done."

    session = StorageFactory.getNewSession()

    setting = Setting(key='robot', value=robots[0].name)
    session.add(setting)

    interaction = Interaction()
    interaction.startTime = datetime.datetime.utcnow()
    interaction.endTime = datetime.datetime.utcnow()
    interaction.operator = operators[0]
    interaction.user = users[3]
    session.add(interaction)

    session.add_all([r for r in robots if r.name == setting.value])
    session.add_all(actions)
    session.add_all(triggers)
    session.add_all(operators)
    session.add_all(users)
    session.commit()
    session.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Subdir not specified"
#         exit()
        subDir = 'kaspar-1c'
    else:
        subDir = sys.argv[1]

    if len(sys.argv) > 2:
        flush = sys.argv[2].lower() == 'flush'
    else:
        flush = False

    baseDir = os.path.dirname(os.path.realpath(__file__))
    configDir = os.path.join(baseDir, 'Config/kasparConfigs/' + subDir)

    if not os.path.isdir(configDir):
        print "Specified subdir does not exist: %s" % subDir
        exit()
    else:
        _flushAndFillTestData(configDir, flush)
