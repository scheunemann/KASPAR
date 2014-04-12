#!/usr/bin/python
import os
import sys
import logging
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../robotActionController')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../')))

from Config.config import webConfig, configureLogging
from werkzeug.wsgi import DispatcherMiddleware
from werkzeug.serving import run_simple
siteRoot = None


def configureSite():
    from api.root import root as apiRoot
    from gui.root import root as guiRoot
    global siteRoot
    siteRoot = DispatcherMiddleware(guiRoot, {'/api': apiRoot})

    # Configure logging
#     configureLogging(level=logging.INFO)

    # Disable connection for debugging without a robot
    from Robot.ServoInterface import ServoInterface
    from Processor.SensorInterface import SensorInterface
    ServoInterface.disconnected = True
    SensorInterface.disconnected = True


def runSite():
    global siteRoot
    if siteRoot == None:
        raise Exception("Site not configured, run configureSite() first")

    host = webConfig.get('server.socket_host', 'localhost')
    port = webConfig.get('server.socket_port', 5000)
    # start the server, use_reloader=False allows debugging in the IDE
    run_simple(host, port, siteRoot, threaded=True, use_reloader=False)

if __name__ == '__main__':
    configureSite()
    runSite()
