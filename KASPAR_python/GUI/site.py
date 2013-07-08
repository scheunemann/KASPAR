#Add project reference
import cherrypy
#import root

import os
current_dir = os.path.dirname(os.path.abspath(__file__))

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
    },
    '/angularjs': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': os.path.join(current_dir, 'angularjs/angular-phonecat/app')
    }
}

#cherrypy.quickstart(root.root, '/', conf)

class Root:
    @cherrypy.expose
    def index(self):
        return ""

if __name__ == '__main__':
    cherrypy.quickstart(Root(), '/', config=conf)