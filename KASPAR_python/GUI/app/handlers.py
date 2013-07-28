from cherrypy.lib.static import serve_file
import cherrypy
import os

class Index(object):
    exposed = True

    def __init__(self, index='index.html'):
        self._index = index

    def GET(self, *args, **kwargs):
        if not cherrypy.request.path_info.endswith('/'):
            raise cherrypy.HTTPRedirect(cherrypy.request.path_info + '/')
        path = os.path.join(os.path.dirname(os.path.realpath(__file__)), self._index)
        return serve_file(path)
    
    def PUT(self):
        pass

class StaticFile(object):
    exposed = True
    def __init__(self, fileName):
        self._file = fileName
    
    def GET(self, *args, **kwargs):
        if os.path.isfile(self._file):
            return serve_file(self._file)
        else:
            raise cherrypy.HTTPError(404)

class StaticFiles(object):
    exposed = True
    def __init__(self, rootDir, allowListDir = False):
        self._root = rootDir
        self._allowList = allowListDir
    
    def GET(self, *args, **kwargs):
        path = ''
        for arg in args:
            path = os.path.join(path, arg)

        if path == '' and not self._allowList:
            raise cherrypy.HTTPError(403, 'Directory Listing Denied')
        
        ospath = os.path.join(self._root, path)
        if os.path.isfile(ospath):
            return serve_file(ospath)
        else:
            raise cherrypy.HTTPError(404)
