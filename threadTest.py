from Data.storage import StorageFactory
from threading import Thread
from Data.Model import Action, Robot
from config import dbConfig
from ActionRunner import ActionRunner
import logging


class TestClass(Thread):

    def __init__(self, actionId):
        super(TestClass, self).__init__()
        self._actionId = actionId

    def run(self):
        session = StorageFactory.getNewSession()
        action = session.query(Action).get(self._actionId)
        print action.name


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    StorageFactory.config['engine'].update(dbConfig)
    session = StorageFactory.getNewSession()

    action = session.query(Action).get(1)
    robot = session.query(Robot).get(1)
    handle = ActionRunner(robot).executeAsync(action)

    handle.waitForComplete()

    for (ts, msg) in handle.output:
        print '%s: %s' % (ts, msg)
