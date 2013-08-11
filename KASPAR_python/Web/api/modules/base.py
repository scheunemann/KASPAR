import cherrypy
from crud import ModelCRUD
import datetime
import json

class SimpleBase(object):
    exposed = True
    
    def __init__(self, data):
        self._data = data
    
    def GET(self):
        return json.dumps(self._data)

class ServiceBase(object):
    exposed = False
    _objects = []
    
    @property
    def title(self):
        return type(self).__name__
    
    def _getTypes(self):
        ret = []
        for obj in self._objects:
            if (not hasattr(obj, "strip") and hasattr(obj, "__getitem__") or hasattr(obj, "__iter__")):
                ret.append(obj[0])
            else:
                ret.append(obj)
        
        return ret
    
    @property
    def links(self):
        return map(lambda x: (x.__name__.capitalize(), x.__name__.lower()), self._getTypes())
    
    def __init__(self):
        for obj in self._objects:
            if (not hasattr(obj, "strip") and hasattr(obj, "__getitem__") or hasattr(obj, "__iter__")):
                setattr(self, obj[0].__name__.lower(), ModelCRUD(obj[0], obj[1]))
            else:
                setattr(self, obj.__name__.lower(), ModelCRUD(obj))
            
    def GET(self):
        return json.dumps(self._getServiceDescriptor())
    
    def _getServiceDescriptor(self):
        return {
            "type": "jsonwsp/description",
            "version": "1.0",
            "servicename": self.title + "Service",
            "url": cherrypy.url(),
            "types": self._getServiceTypes(),
            "methods": self._getServiceMethods(), 
        }

    def _getServiceTypes(self):
        types = {}
        for type_ in self._getTypes():
            types[type_.__name__.capitalize()] = self._getTypeProperties(type_)
        
        return types
    
    def _getTypeProperties(self, type_):
        props = {}
        for attrName, attrType in type_.getDesc(type_).iteritems():
            props[attrName] = self._formatType(attrType)
        
        return props
                
    def _formatType(self, attrType):
        if attrType in (str, datetime.datetime):
            return "string"
        elif attrType in (int, ):
            return "number"
        elif attrType in (float, ):
            return "float"
        else:
            return str(attrType)
        
    def _getServiceMethods(self):
        #TODO: Tackle this at some later time
        methods = {}
#        for obj in dir(self):
#            if isinstance(getattr(self, obj), ModelCRUD):
#                model = getattr(self, obj)
#                if model._exposed['GET']:
#                    argspec = inspect.getargspec(model.GET)         
#                    if len(argspec.args) == len(argspec.defaults) - 1:
#                        methods['get%s' ]
                    
                    
                    
                    
                    
                    
                    
