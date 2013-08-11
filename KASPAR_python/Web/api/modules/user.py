import Data.Model
from crud import ModelCRUD

class CustomAction(ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(CustomAction, self).__init__(Data.Model.CustomAction, ['GET', 'POST', 'DELETE'])
    
class CustomTrigger(ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(CustomTrigger, self).__init__(Data.Model.CustomTrigger, ['GET', 'POST', 'DELETE'])
