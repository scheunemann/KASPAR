import cherrypy
import os

from modules import menu, moduleParser


name = "Kaspar API"
_dir = os.path.dirname(os.path.realpath(__file__))


class Root(object):
    @cherrypy.expose
    def GET(self):
        return "API Index"

_modules = moduleParser.loadModules('modules/services.py')
# _moduleLinks = {}

root = Root()
for name, type_ in _modules.iteritems():
    setattr(root, name.lower(), type_)
#    links = []
#    for link in type_.links:
#        links.append((link[0], "%s/%s" %(name.lower(), link[1])))
#
#    _moduleLinks[type_.title] = links

# root.menuOptions = menu.MenuData(_moduleLinks)

_menuLinks = [
                {
                 'title': 'Admin',
                 'links': [
                            ('Operators', 'admin.operator'),
                            ('Users', 'admin.user'),
                            ('Robots', 'admin.robot'),
                            ('Settings', 'admin.setting'),
                          ]},
                {
                 'title':'Action',
                 'links': [
                            ('Create/Edit', 'action.edit'),
                            ('Test', 'action.test'),
                            ('Import', 'action.import'),
                          ]},
                {
                 'title':'Trigger',
                 'links': [
                            ('Create/Edit', 'trigger.edit'),
                            ('Test', 'trigger.test'),
                            ('Import', 'trigger.import'),
                          ]},
                {
                 'title':'Interactions',
                 'links': [
                            ('View History', 'interaction.view'),
                            ('Begin New', 'interaction.begin'),
                            ('Manage History', 'interaction.manage'),
                          ]},
            ]
root.menuOptions = menu.MenuData(_menuLinks)

config = {
          '/': {
               'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
               'tools.trailing_slash.on': True,
               }
          }
