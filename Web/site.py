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
    from api.root import root as apiRoot
    from gui.root import root as guiRoot
    global siteRoot
    siteRoot = DispatcherMiddleware(guiRoot, {'/api': apiRoot})

    host = webConfig.get('server.socket_host', 'localhost')
    port = webConfig.get('server.socket_port', 5000)
    global server
    server = SocketIOServer((host, port), siteRoot, resource='api/socket.io')

    apiRoot.server = server

    # Configure logging
    configureLogging()

    # Disable connection for debugging without a robot
    from Robot.ServoInterface import ServoInterface
    from Processor.SensorInterface import SensorInterface
    ServoInterface.disconnected = True
    SensorInterface.disconnected = True


def runSite():
    global server
    if server == None:
        raise Exception("Site not configured, run configureSite() first")

    # start the server, use_reloader=False allows debugging in the IDE
    if webConfig.get('server.use_reloader', False):
        def run_server():
            global server
            server.serve_forever()
        run_with_reloader(run_server)
    else:
        server.serve_forever()

if __name__ == '__main__':
    configureSite()
    runSite()
