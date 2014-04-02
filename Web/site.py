#!/usr/bin/python
import os
import sys
import logging
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../robotActionController')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../')))

from Config.config import webConfig, configureLogging
from Web import app

_dir = os.path.dirname(os.path.realpath(__file__))

if __name__ == '__main__':
    global settings
    profile = False
    app.config.update(webConfig)

    # Configure logging
#     configureLogging(level=logging.CRITICAL)

    print app.url_map

#     start the server
    app.run(use_reloader=False)
