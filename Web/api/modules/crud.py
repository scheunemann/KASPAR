import cherrypy
import logging
from sqlalchemy.orm import with_polymorphic


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
        self._exposed = {'POST': False, 'PUT': False, 'GET': False, 'DELETE': False}
        for method in methods:
            if hasattr(self, method.upper()):
                self._exposed[method] = True
            else:
                logging.warn("Unknown request method: %s" % method)

    def _save(self, oid, **constraint):
        (data, resolveList) = self._modelClass.deserialize(self._modelClass, cherrypy.request.json, cherrypy.request.db)
        try:
            if data.id == None:
                # New object
                cherrypy.request.db.add(data)
            else:
                cherrypy.request.db.merge(data)
        except Exception as ex:
            raise cherrypy.HTTPError(500, ex)

        cherrypy.request.db.commit()
        
        return (data, resolveList)

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None, **constraint):
        if not self._exposed['POST']:
            raise cherrypy.HTTPError(405)

        (data, resolveList) = self._save(oid, **constraint)

        return data.serialize(urlResolver=self._urlResolver, resolveProps=resolveList)

    @cherrypy.tools.json_out()
    def GET(self, oid=None, resolve=[], **constraint):
        if not self._exposed['GET']:
            raise cherrypy.HTTPError(405)

        if oid == None:
            queryClass = with_polymorphic(self._modelClass, '*')
            if constraint:
                for (key, value) in constraint.iteritems():
                    if value == 'null' or value == 'None':
                        constraint[key] = None
                ret = [o.serialize(urlResolver=self._urlResolver, resolveProps=resolve) for o in cherrypy.request.db.query(queryClass).filter_by(**constraint).all()]
            else:
                ret = [o.serialize(urlResolver=self._urlResolver, resolveProps=resolve) for o in cherrypy.request.db.query(queryClass).all()]
        else:
            ret = cherrypy.request.db.query(self._modelClass).get(oid)
            if ret == None:
                raise cherrypy.NotFound()
            else:
                ret = ret.serialize(urlResolver=self._urlResolver, resolveProps=resolve)

        return ret

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def PUT(self, data):
        if not self._exposed['PUT']:
            raise cherrypy.HTTPError(405)

        (data, resolveList) = self._modelClass.deserialize(self._modelClass, cherrypy.request.json, cherrypy.request.db)
        cherrypy.request.db.add(data)
        return self.GET(oid=data.id, resolve=resolveList)

    def DELETE(self, oid):
        if not self._exposed['DELETE']:
            raise cherrypy.HTTPError(405)

        obj = cherrypy.request.db.query(self._modelClass).get(oid)
        cherrypy.request.db.delete(obj)

    @staticmethod
    def _urlResolver(class_, instance=None):
        if class_ not in ModelCRUD._uriCache:
            url = ModelCRUD._urlBuilder(class_, cherrypy.tree.apps['/api'].root, instance)
            if url == None:
                for cls in class_.__bases__:
                    url = ModelCRUD._urlBuilder(cls, cherrypy.tree.apps['/api'].root, instance)
                    if url:
                        break

            if url != None:
                url = '/api/%s' % url
            else:
                url = ''
            ModelCRUD._uriCache[class_] = url
        return ModelCRUD._uriCache[class_]

    @staticmethod
    def _urlBuilder(class_, root, instance=None):
        if hasattr(root, '__dict__'):
            for key in dir(root):
                value = getattr(root, key)
                if isinstance(value, ModelCRUD):
                    if issubclass(value._modelClass, class_):
                        if instance != None:
                            return '%s/%s' % (key, instance.id)
                        else:
                            return '%s/:id' % key
                    else:
                        k = ModelCRUD._urlBuilder(class_, value)
                        if k != None:
                            return '%s/%s' % (key, k)
        return None
