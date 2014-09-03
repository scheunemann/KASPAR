import os
import datetime
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../robotActionController')))

from Config.config import dbConfig
from Model import Base, User, Operator, Interaction, Setting
from Data.storage import StorageFactory
from Robot import importer
StorageFactory.config['engine'].update(dbConfig)


def _flushData():
    StorageFactory.getDefaultDataStore().engine.echo = True
    StorageFactory.drop_keys(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.drop_all(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.create_all(StorageFactory.getDefaultDataStore().engine)
    StorageFactory.getDefaultDataStore().engine.echo = False


def _loadConfigs(configDir):
    print "Loading configs..."
    (robots, actions, triggers) = importer.loadDirectory({}, {}, [], configDir)
    print "Saving data"

    session = StorageFactory.getNewSession()
    session.add_all(robots)
    session.add_all(actions)
    session.add_all(triggers)
    session.commit()
    session.close()
    print "Done."


def _setRobot(robotName):

    session = StorageFactory.getNewSession()
    setting = Setting(key='robot', value=robotName)
    session.add(setting)
    session.commit()
    session.close()


def _loadTestData():
    session = StorageFactory.getNewSession()

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
    session.add_all(operators)
    session.add_all(users)

    interaction = Interaction()
    interaction.startTime = datetime.datetime.utcnow()
    interaction.endTime = datetime.datetime.utcnow()
    interaction.operator = operators[0]
    interaction.user = users[3]
    session.add(interaction)
    session.commit()
    session.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Subdir not specified"
#         exit()
        subDir = 'kaspar-1c'
        flush = True
        fill = True
    else:
        subDir = sys.argv[1]

        if len(sys.argv) > 2:
            if sys.argv[2].lower() == 'flush':
                flush = True
                fill = False
            elif sys.argv[2].lower() == 'test':
                flush = True
                fill = True
            elif sys.argv[2].lower() == 'data':
                flush = False
                fill = True
        else:
            flush = False
            fill = False

    baseDir = os.path.dirname(os.path.realpath(__file__))
    configDir = os.path.join(baseDir, 'Config/kasparConfigs/' + subDir)

    if not os.path.isdir(configDir):
        print "Specified subdir does not exist: %s" % subDir
        exit()
    else:
        if flush:
            _flushData()
        _loadConfigs(configDir)
        if fill:
            _loadTestData()
        _setRobot(subDir)
