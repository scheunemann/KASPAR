import logging
import cherrypy
import json

class ModelCRUD(object):    
    exposed = False
    
    @property
    def links(self):
        return []
    
    @property
    def title(self):
        return self._modelClass.__name__
    
    def __init__(self, modelClass, methods=['GET', ]):
        self._modelClass = modelClass
        self._exposed = { 'POST': False, 'PUT': False, 'GET': False, 'DELETE': False }
        for method in methods:
            if hasattr(self, method.upper()):
                self._exposed[method] = True
            else:
                logging.warn("Unknown request method: %s" % method)
        
    def POST(self, oid=None):
        if not self._exposed['POST']:
            raise cherrypy.NotFound()
        
        jsonData = json.loads(cherrypy.request.body.read())
        data = self._modelClass.deserialize(self._modelClass, jsonData, cherrypy.request.db)
        if oid == None:
            #New object
            cherrypy.request.db.add(data)
        else:
            cherrypy.request.db.merge(data)
            
        cherrypy.request.db.commit()
        return json.dumps(data.serialize())

    def GET(self, oid=None, constraint=None):
        if not self._exposed['GET']:
            raise cherrypy.NotFound()

        if oid == None:
            if constraint == None:
                ret = [o.serialize() for o in cherrypy.request.db.query(self._modelClass).all()]
            else:
                ret = [o.serialize() for o in cherrypy.request.db.query(self._modelClass).filter_by(**constraint).all()]
        else:
            ret = cherrypy.request.db.query(self._modelClass).get(oid)
            if ret == None:
                raise cherrypy.NotFound()
            else:
                ret = ret.serialize()
        
        return json.dumps(ret)

    def PUT(self, data):
        if not self._exposed['PUT']:
            raise cherrypy.NotFound()

        obj = cherrypy.request.db.query(self._modelClass).get(data['id'])
        obj = self._updateObject(data, obj)
        cherrypy.request.db.add(obj)
    
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
