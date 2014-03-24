import os


name = "Kaspar GUI Root"
_dir = os.path.dirname(os.path.realpath(__file__))


class Root(object):
    pass

root = Root()

config = {
          '/faveicon.ico': {
               'tools.staticfile.on': True,
               'tools.staticfile.filename': os.path.join(_dir, 'static/images/favicon.ico')
               },
          '/': {
               'tools.staticdir.on': True,
               'tools.staticdir.dir': _dir,
               'tools.caching.on': True,
               'tools.staticdir.index': 'index.html',
               'tools.staticdir.content_types': {'woff': 'application/x-font-woff'}
               },
          }
