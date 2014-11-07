#!/usr/bin/env python
import sys
import logging

from kasparGUI.Config.config import webConfig, configureLogging
from werkzeug.wsgi import DispatcherMiddleware
# from werkzeug.serving import run_simple
# We use websockets inside the robotinterface, this doesn't work with the werkzeug server
from werkzeug.serving import run_with_reloader
from socketio.server import SocketIOServer
from robotActionController.ActionRunner.base import ActionRunner
siteRoot = None
server = None


def configureSite():
    # Configure logging
    configureLogging(webConfig.get('loglevel', logging.DEBUG))

    from Web.gui.root import _subDir as guiDir, root as guiRoot
    logging.getLogger(__name__).info('Gui using source from %s directory' % guiDir)

    from Web.api.root import root as apiRoot
    global siteRoot
    siteRoot = DispatcherMiddleware(guiRoot, {'/api': apiRoot})

    host = webConfig.get('server.socket_host', 'localhost')
    port = webConfig.get('server.socket_port', 5000)
    global server
    server = SocketIOServer((host, port), siteRoot, resource='api/socket.io')

    apiRoot.server = server

    import platform
    if platform.system() == 'Windows' and len(sys.argv) > 1 and sys.argv[1].lower() == 'debug':
        # Disable connection for debugging without a robot
        logging.getLogger(__name__).warning('Site running in DEBUG mode, no commands will be sent to the robot')
        from robotActionController.Robot.ServoInterface import ServoInterface
        from robotActionController.Processor.SensorInterface import SensorInterface
        ServoInterface.disconnected = True
        SensorInterface.disconnected = True


def wakeUp():
    from robotActionController.ActionRunner import ActionManager
    from robotActionController.Data.storage import StorageFactory
    from kasparGUI import Model
    ds = StorageFactory.getNewSession()
    robot = ds.query(Model.Robot).join(Model.Setting, Model.Robot.name==Model.Setting.value).filter(Model.Setting.key=='robot').first()
    if not robot:
        setting = ds.query(Model.Setting).filter(Model.Setting.key=='robot').first()
        logging.getLogger(__name__).error("Unable to locate robot with name %s" % (setting, ))
    elif robot.defaultAction:
        from robotActionController.Robot import Robot
        logging.getLogger(__name__).info("Starting %s's default Action (%s)" % (robot.name, robot.defaultAction))
        robotInt = Robot.getRunableRobot(robot)
        manager = ActionManager.getManager(robotInt)
        action = ActionRunner.getRunable(robot.defaultAction)
        manager.executeActionAsync(action)


def runSite():
    global server
    if server == None:
        raise Exception("Site not configured, run configureSite() first")

    logging.getLogger(__name__).error('Spawning web server, ready for connections on port %s' % server.server_port)

    # start the server, use_reloader=False allows debugging in the IDE
    if webConfig.get('server.use_reloader', False):
        def run_server():
            global server
            wakeUp()
            server.serve_forever()
        run_with_reloader(run_server)
    else:
        try:
            wakeUp()
            server.serve_forever()
        except KeyboardInterrupt:
            return

if __name__ == '__main__':
    configureSite()
    runSite()
