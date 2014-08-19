#!/usr/bin/env python
import os
import sys
import logging
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../robotActionController')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../')))

from Config.config import webConfig, configureLogging
from werkzeug.wsgi import DispatcherMiddleware
# from werkzeug.serving import run_simple
# We use websockets inside the robotinterface, this doesn't work with the werkzeug server
from werkzeug.serving import run_with_reloader
from socketio.server import SocketIOServer
siteRoot = None
server = None


def configureSite():
    # Configure logging
    configureLogging(logging.DEBUG)

    from gui.root import _subDir as guiDir, root as guiRoot
    logging.getLogger(__name__).info('Gui using source from %s directory' % guiDir)

    from api.root import root as apiRoot
    global siteRoot
    siteRoot = DispatcherMiddleware(guiRoot, {'/api': apiRoot})

    host = webConfig.get('server.socket_host', 'localhost')
    port = webConfig.get('server.socket_port', 5000)
    global server
    server = SocketIOServer((host, port), siteRoot, resource='api/socket.io')

    apiRoot.server = server

    import platform
    if platform.system() == 'Windows':
        # Disable connection for debugging without a robot
        from Robot.ServoInterface import ServoInterface
        from Processor.SensorInterface import SensorInterface
        ServoInterface.disconnected = True
        SensorInterface.disconnected = True


def runSite():
    global server
    if server == None:
        raise Exception("Site not configured, run configureSite() first")

    logging.getLogger(__name__).info('Spawning web server, ready for connections')

    # start the server, use_reloader=False allows debugging in the IDE
    if webConfig.get('server.use_reloader', False):
        def run_server():
            global server
            server.serve_forever()
        run_with_reloader(run_server)
    else:
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            return

if __name__ == '__main__':
    configureSite()
    runSite()
