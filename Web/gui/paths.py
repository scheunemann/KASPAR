import os
import cherrypy
import re
from cherrypy.lib.static import serve_file

addTypes = {'woff': 'application/x-font-woff'}
name = "Kaspar GUI Root"
_dir = os.path.dirname(os.path.realpath(__file__))
isFile = re.compile('(.*/)?.+\.[^/]+')


class Root(object):
    """since angular is set to html5Mode(true) anything that's not a direct file reference """
    """ has to redirect to the index.html file """
    """https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode"""
    @cherrypy.expose
    def default(self, *args):
        if args:
            name = '/'.join(args)
        else:
            name = 'index.html'
        if not isFile.match(name):
            name = 'index.html'

        path = os.path.join(_dir, name)
        _, ext = os.path.splitext(name)
        content_type = addTypes.get(ext[1:], None)

        return serve_file(path, content_type=content_type)


root = Root()

config = {
          '/faveicon.ico': {
               'tools.staticfile.on': True,
               'tools.staticfile.filename': os.path.join(_dir, 'static/images/favicon.ico')
               },
          '/': {
#                'tools.staticdir.on': True,
#                'tools.staticdir.dir': _dir,
                'tools.caching.on': True,
#                'tools.staticdir.index': 'index.html',
#                'tools.staticdir.content_types': addTypes
               },
          }
