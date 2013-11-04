import os
import cherrypy
import gui
import api
import SAPlugin
from Data.Storage import StorageFactory

_dir = os.path.dirname(os.path.realpath(__file__))

conf = {
        'server.socket_host': '0.0.0.0',
        'server.socket_port': 1055,
        'server.thread_pool': 10,
        'server.thread_pool_max':-1,
        # 'environment': 'production'
}

dbConf = {
        'type':'MySql',
        'host':'localhost',
        'user':'kaspar',
        'pass':'kaspar',
        'db':'kaspar',
}

if __name__ == '__main__':
    global disconnected
    disconnected = False
    
    #global settings
    cherrypy.config.update(conf)
    StorageFactory.config['engine'].update(dbConf)

    #attach the database
    SAPlugin.SAEnginePlugin(cherrypy.engine).subscribe()
    cherrypy.tools.db = SAPlugin.SATool()
    cherrypy.config.update({'tools.db.on': True})

    #mount the root paths
    cherrypy.tree.mount(gui.root, '/', gui.config)
    cherrypy.tree.mount(api.root, '/api', api.config)
#     cherrypy.tree.mount(None, '/ang', config = {
#           '/':{
#                'tools.staticdir.on': True,
#                'tools.staticdir.dir': os.path.join(_dir, 'angular-phonecat/app'),
#                'tools.staticdir.index': 'index.html'
#                }})
        
    #start the server
    cherrypy.engine.start()
    cherrypy.engine.block()
