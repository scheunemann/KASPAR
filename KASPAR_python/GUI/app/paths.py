import handlers, os, cherrypy
from menu import MenuData
from modules import moduleParser

name = "Site Root"
_dir = os.path.dirname(os.path.realpath(__file__))

class Root(object): pass

root = Root()
root.api = Root()
root.api.menuOptions = MenuData(moduleParser.loadModules(root.api))

config = {
          '/':{
               'tools.staticdir.on': True,
               'tools.staticdir.dir': os.path.join(_dir, 'templates'),
               'tools.staticdir.index': 'index.html'
               },
          '/faveicon.ico':{
               'tools.staticfile.on': True,
               'tools.staticfile.filename': os.path.join(_dir, 'static/images/favicon.ico')
               },
          '/static':{
               'tools.staticdir.on': True,
               'tools.staticdir.dir': os.path.join(_dir, 'static')
               },
          '/api': {
               'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
               'tools.trailing_slash.on': True,
               }
          }
