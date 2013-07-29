import os, cherrypy
from Web.api.modules import moduleParser
from Web.api.modules import menu

name = "Kaspar API"
_dir = os.path.dirname(os.path.realpath(__file__))

class Root(object): 
    @cherrypy.expose
    def GET(self):
        return "API Index"

_modules = moduleParser.loadModules()
_moduleLinks = {}

root = Root()
for name, type_ in _modules.iteritems():
    links = []
    for link in type_.links:
        links.append((link[0], "%s/%s" %(name.lower(), link[1])))
        
    _moduleLinks[type_.title] = links
    setattr(root, name.lower(), type_())

root.menuOptions = menu.MenuData(_modules)

print dir(root)

config = {
          '/': {
               'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
               'tools.trailing_slash.on': True,
               }
          }
