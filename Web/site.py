import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../robotActionController')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../')))

import cherrypy

from Data.storage import StorageFactory
import api
from config import dbConfig, webConfig
import gui
from sqlAlchemyPlugin import SATool, SAEnginePlugin
import logging

_dir = os.path.dirname(os.path.realpath(__file__))

if __name__ == '__main__':
    # global settings
    profile = False
    cherrypy.config.update(webConfig)
    StorageFactory.config['engine'].update(dbConfig)
    StorageFactory.config['debug'] = True

    # Configure logging
    logging.basicConfig(level=logging.CRITICAL)

    # attach the database
    SAEnginePlugin(cherrypy.engine).subscribe()
    cherrypy.tools.db = SATool()
    cherrypy.config.update({'tools.db.on': True})

    # mount the root paths
    siteRoot = cherrypy.Application(gui.root, '/', gui.config)
    apiRoot = cherrypy.Application(api.root, '/api', api.config)

    if profile:
        from cherrypy.lib import profiler
        baseDir = os.path.dirname(os.path.abspath(__file__))
        profDir = os.path.join(baseDir, 'profiles')
        if not os.path.isdir(profDir):
            os.makedirs(profDir)

        cherrypy.tree.mount(profiler.make_app(siteRoot, path=profDir), '/', gui.config)
        cherrypy.tree.mount(profiler.make_app(apiRoot, path=profDir), '/api', api.config)
    else:
        cherrypy.tree.mount(siteRoot)
        cherrypy.tree.mount(apiRoot)

    # start the server
    cherrypy.engine.start()
    cherrypy.engine.block()
