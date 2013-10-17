import logging
import cherrypy

class ModelCRUD(object):    
    exposed = False
    _uriCache = {}
    
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
        
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None):
        if not self._exposed['POST']:
            raise cherrypy.NotFound()
        
        data = self._modelClass.deserialize(self._modelClass, cherrypy.request.json, cherrypy.request.db)
        if oid == None:
            #New object
            cherrypy.request.db.add(data)
        else:
            cherrypy.request.db.merge(data)
            
        cherrypy.request.db.commit()
        return data.serialize(urlResolver=self._urlResolver)

    @cherrypy.tools.json_out()
    def GET(self, oid=None, constraint=None):
        if not self._exposed['GET']:
            raise cherrypy.NotFound()

        if oid == None:
            if constraint == None:
                ret = [o.serialize(urlResolver=self._urlResolver) for o in cherrypy.request.db.query(self._modelClass).all()]
            else:
                ret = [o.serialize(urlResolver=self._urlResolver) for o in cherrypy.request.db.query(self._modelClass).filter_by(**constraint).all()]
        else:
            ret = cherrypy.request.db.query(self._modelClass).get(oid)
            if ret == None:
                raise cherrypy.NotFound()
            else:
                ret = ret.serialize(urlResolver=self._urlResolver)
        
        return ret

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def PUT(self, data):
        if not self._exposed['PUT']:
            raise cherrypy.NotFound()

        data = self._modelClass.deserialize(self._modelClass, cherrypy.request.json, cherrypy.request.db)
        cherrypy.request.db.add(data)
        return data.serialize(urlResolver=self._urlResolver)
    
    def DELETE(self, oid):
        if not self._exposed['DELETE']:
            raise cherrypy.NotFound()

        obj = cherrypy.request.db.query(self._modelClass).get(oid)
        cherrypy.request.db.delete(obj)
    
    @staticmethod
    def _urlResolver(class_):
        if not ModelCRUD._uriCache.has_key(class_):
            url = ModelCRUD._urlBuilder(class_, cherrypy.tree.apps['/api'].root)
            if url != None:
                url = '/api/%s' % url
            else:
                url = ''
            ModelCRUD._uriCache[class_] = url  
        return ModelCRUD._uriCache[class_]
    
    @staticmethod
    def _urlBuilder(class_, root):
        if hasattr(root, '__dict__'):
            for key in dir(root):
                value = getattr(root, key)
                if isinstance(value, ModelCRUD):
                    if issubclass(value._modelClass, class_):
                        return '%s/:id' % key
                    else:
                        k = ModelCRUD._urlBuilder(class_, value)
                        if k != None:
                            return '%s/%s' % (key, k)
        return None
