import cherrypy
import app

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
    
    #start the server
    cherrypy.engine.start()
    cherrypy.engine.block()
