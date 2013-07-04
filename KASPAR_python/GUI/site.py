#Add project reference
import cherrypy
import root

conf = {
    'global': {
        'server.socket_host': '0.0.0.0',
        'server.socket_port': 1055,
        'server.thread_pool': 10,
        'server.thread_pool_max': -1,
        #'environment': 'production'
    },
    '/': {
        'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
    }
}

cherrypy.quickstart(root.root, '/', conf)