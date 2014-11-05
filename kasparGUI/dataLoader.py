import os
import sys

from Config.config import dbConfig, globalConfig
from kasparGUI.Model import Base, User, Operator, Setting, Action
from robotActionController.Data.storage import StorageFactory
from robotActionController.Robot import importer
import legacyImporter
StorageFactory.config['engine'].update(dbConfig)
StorageFactory.config['dataFolder'] = globalConfig['dataFolder']


def _flushData():
    if not os.path.isdir(StorageFactory.config['dataFolder']):
        os.makedirs(StorageFactory.config['dataFolder'])
    StorageFactory.getDefaultDataStore().engine.echo = True
    StorageFactory.drop_keys(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.drop_all(StorageFactory.getDefaultDataStore().engine)
    from shutil import rmtree
    for dir in [d for (d, _, _) in os.walk(StorageFactory.config['dataFolder'])][1:]:
        rmtree(dir, True)
    Base.metadata.create_all(StorageFactory.getDefaultDataStore().engine)
    StorageFactory.getDefaultDataStore().engine.echo = False


def _loadConfigs(configDir, configFile='robot.xml'):
    print "Loading configs... for %s in directory %s" % (configFile, configDir)
    robotConfig = os.path.join(configDir, configFile)
    if not os.path.isfile(robotConfig):
        return None
    root = importer.getConfigRoot(robotConfig)
    configType = root.tag
    session = StorageFactory.getNewSession()
    actions = {action.name: action for action in session.query(Action).all()}

    if configType == 'KASPAR':
        (robots, actions, triggers, games) = legacyImporter.loadDirectory({}, actions, [], [], configDir)
    else:
        (robots, actions, triggers) = importer.loadDirectory({}, actions, [], configDir, root)
        games = []

    robot = robots[0].name
    print "Saving data"

    session.add_all(robots)
    session.add_all(actions)
    session.add_all(triggers)
    session.add_all(games)
    session.commit()
    session.close()
    print "Done."
    return robot


def _setRobot(robotName):

    session = StorageFactory.getNewSession()
    setting = Setting(key='robot', value=robotName)
    session.add(setting)
    session.commit()
    session.close()


def _loadBaseData():
    session = StorageFactory.getNewSession()

    operators = [
                    Operator('UH', 'University of Hertfordshire'),
                 ]

    session.add_all(operators)

    session.commit()
    session.close()


def _loadTestData():
    session = StorageFactory.getNewSession()

    operators = [
                    Operator('Operator1', 'Test Operator 1'),
                    Operator('Operator2', 'Test Operator 2'),
                    Operator('Operator3', 'Test Operator 3'),
                    Operator('Operator4', 'Test Operator 4'),
                 ]

    users = [
             User('User1', 'User 1'),
             User('User2', 'User 2'),
             User('User3', 'User 3'),
             User('User4', 'User 4'),
             User('User5', 'User 5'),
             User('User6', 'User 6'),
             User('User7', 'User 7'),
             User('User8', 'User 8'),
             User('User9', 'User 9'),
             User('User0', 'User 10'),
             User('User11', 'User 11'),
             User('User12', 'User 12'),
             User('User13', 'User 13'),
             User('User14', 'User 14'),
             ]

    operators[0].users.extend(users[1:3])
    session.add_all(operators)
    session.add_all(users)

    session.commit()
    session.close()


if __name__ == "__main__":
    flush = False
    fill = False
    configFile = 'robot.xml'
    if len(sys.argv) < 2:
        print "Subdir not specified"
#         exit()
        subDir = 'kaspar3'
        configFile = 'kaspar3-1.xml'
        flush = True
        fill = True
    else:
        subDir = sys.argv[1]

        index = 2
        if len(sys.argv) > 2:
            if ".xml" in sys.argv[2]:
                configFile = sys.argv[2]
                index += 1

        if len(sys.argv) > index:
            if sys.argv[index].lower() == 'flush':
                flush = True
            elif sys.argv[index].lower() == 'test':
                flush = True
                fill = True
            elif sys.argv[index].lower() == 'data':
                fill = True

    baseDir = os.path.dirname(os.path.realpath(__file__))
    configDir = os.path.join(baseDir, 'Config/kasparConfigs/' + subDir)

    if not os.path.isdir(configDir):
        print "Specified subdir does not exist: %s" % subDir
        exit()
    else:
        print "Flushing: %s, TestData: %s" % (flush, fill)

        if flush:
            _flushData()
            _loadBaseData()
        robot = _loadConfigs(configDir, configFile)
        if fill:
            _loadTestData()
        _setRobot(robot)
