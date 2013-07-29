import logging
import cherrypy

class ModelCRUD(object):
    
    def __init__(self, modelClass, methods=['GET', ]):
        self._modelClass = modelClass
        self._exposed = { 'POST': False, 'PUT': False, 'GET': False, 'DELETE': False }
        for method in methods:
            if hasattr(self, method.upper()):
                self._exposed[method] = True
            else:
                logging.warn("Unknown request method: %s" % method)
        
    @cherrypy.expose
    def POST(self, data):
        if not self._exposed['POST']:
            raise cherrypy.NotFound()
        
        obj = self._updateObject(data)
        cherrypy.request.db.add(obj)

    @cherrypy.expose
    def GET(self, oid=None):
        if not self._exposed['GET']:
            raise cherrypy.NotFound()

        if oid == None:
            return cherrypy.request.db.query(self._modelClass).all()
        else:
            return cherrypy.request.db.query(self._modelClass).get(oid)

    @cherrypy.expose
    def PUT(self, data):
        if not self._exposed['PUT']:
            raise cherrypy.NotFound()

        obj = cherrypy.request.db.query(self._modelClass).get(data['id'])
        obj = self._updateObject(data, obj)
        cherrypy.request.db.add(obj)
    
    @cherrypy.expose
    def DELETE(self, oid):
        if not self._exposed['DELETE']:
            raise cherrypy.NotFound()

        obj = cherrypy.request.db.query(self._modelClass).get(oid)
        cherrypy.request.db.delete(obj)
        pass
   
    def _updateObject(self, data, obj=None):
        if obj == None:
            obj = self._modelClass()

        for name, value in data.iteritems():
            if hasattr(obj, name):
                setattr(obj, name, value)
        
        return obj
