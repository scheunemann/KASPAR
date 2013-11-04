import Data.Model
from crud import ModelCRUD
import cherrypy

class CustomAction(ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(CustomAction, self).__init__(Data.Model.CustomAction, ['GET', 'POST', 'DELETE'])
    
class CustomTrigger(ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(CustomTrigger, self).__init__(Data.Model.CustomTrigger, ['GET', 'POST', 'DELETE'])

class User(ModelCRUD):
    exposed = True
    customaction = CustomAction()
    customtrigger = CustomTrigger()
    
    def _cp_dispatch(self, vpath):
        if vpath:
            cherrypy.request.params['constraint'] = {'user_id': vpath.pop(0)}
        if vpath:
            return getattr(self, vpath.pop(0), None)
    
    def __init__(self):
        super(User, self).__init__(Data.Model.User, ['GET', 'POST', 'DELETE'])