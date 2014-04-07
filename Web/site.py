#!/usr/bin/python
import os
import sys
import logging
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../robotActionController')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../')))

from Config.config import webConfig, configureLogging
from werkzeug.wsgi import DispatcherMiddleware
from werkzeug.serving import run_simple

_dir = os.path.dirname(os.path.realpath(__file__))

if __name__ == '__main__':
    from api.root import root as apiRoot
    from gui.root import root as guiRoot
    siteRoot = DispatcherMiddleware(guiRoot, {'/api': apiRoot})

    #siteRoot.config.update(webConfig)

    # Configure logging
    # configureLogging(level=logging.CRITICAL)

    # start the server, use_reloader=False allows debugging in the IDE
    host = webConfig.get('server.socket_host', 'localhost')
    port = webConfig.get('server.socket_port', 5000)
    run_simple(host, port, siteRoot, use_reloader=True)
