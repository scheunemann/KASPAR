import cherrypy
import os

from Data.storage import StorageFactory
import api
from config import dbConfig, webConfig
import gui
from sqlAlchemyPlugin import SATool, SAEnginePlugin
import logging

_dir = os.path.dirname(os.path.realpath(__file__))

if __name__ == '__main__':
    global disconnected
    disconnected = False

    # global settings
    cherrypy.config.update(webConfig)
    StorageFactory.config['engine'].update(dbConfig)

    # Configure loggind
    logging.basicConfig(level=logging.DEBUG)

    # attach the database
    SAEnginePlugin(cherrypy.engine).subscribe()
    cherrypy.tools.db = SATool()
    cherrypy.config.update({'tools.db.on': True})

    # mount the root paths
    cherrypy.tree.mount(gui.root, '/', gui.config)
    cherrypy.tree.mount(api.root, '/api', api.config)
#     cherrypy.tree.mount(None, '/ang', config = {
#           '/':{
#                'tools.staticdir.on': True,
#                'tools.staticdir.dir': os.path.join(_dir, 'angular-phonecat/app'),
#                'tools.staticdir.index': 'index.html'
#                }})

    # start the server
    cherrypy.engine.start()
    cherrypy.engine.block()
