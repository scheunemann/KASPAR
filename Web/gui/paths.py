import os


name = "Kaspar GUI Root"
_dir = os.path.dirname(os.path.realpath(__file__))


class Root(object):
    pass

root = Root()

config = {
          '/': {
               'tools.staticdir.on': True,
               'tools.staticdir.dir': os.path.join(_dir, 'templates'),
               'tools.staticdir.index': 'index.html'
               },
          '/faveicon.ico': {
               'tools.staticfile.on': True,
               'tools.staticfile.filename': os.path.join(_dir, 'static/images/favicon.ico')
               },
          '/static': {
               'tools.staticdir.on': True,
               'tools.staticdir.dir': os.path.join(_dir, 'static'),
               'tools.caching.on': False,
               'tools.staticdir.content_types': {'woff': 'application/x-font-woff'}
               },
          }
