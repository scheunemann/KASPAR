import cherrypy
import app,os

_dir = os.path.dirname(os.path.realpath(__file__))

conf = {
        'server.socket_host': '0.0.0.0',
        'server.socket_port': 1055,
        'server.thread_pool': 10,
        'server.thread_pool_max':-1,
        # 'environment': 'production'
}

if __name__ == '__main__':
    #global settings
    cherrypy.config.update(conf)

    #mount the root paths
    cherrypy.tree.mount(app.root, '/', app.config)
    cherrypy.tree.mount(None, '/ang', config = {
          '/':{
               'tools.staticdir.on': True,
               'tools.staticdir.dir': os.path.join(_dir, 'angular-phonecat/app'),
               'tools.staticdir.index': 'index.html'
               }})
    
    #start the server
    cherrypy.engine.start()
    cherrypy.engine.block()
