from crud import ModelCRUD
from Data.Model import Operator, User, Robot

class ClassProperty(object):
    def __init__(self, func):
        self.func = func
    def __get__(self, inst, cls):
        return self.func(cls)

class Admin(object):
    _objects = [Operator, User, Robot]
    exposed = True
    title = "Admin"
    
    @staticmethod
    def loadLinks(cls):
        ret = []
        for obj in cls._objects:
            ret.append(obj.__class__, obj.__class__.lower())
        
        return ret
    
    links = loadLinks()
    
    def __init__(self):
        for obj in self._objects:
            setattr(self, obj.__class__.lower(), ModelCRUD(obj))
