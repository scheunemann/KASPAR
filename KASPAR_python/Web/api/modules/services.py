import Data.Model
import base
import crud
from robot import Robot
from user import User
from legacy import ActionImport, TriggerImport

__all__ = ['Operator', 'Robot', 'User', 'Action', 'Joint', 'Trigger']

class Robot(Robot):
    pass

class User(User):
    pass

class Operator(crud.ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(Operator, self).__init__(Data.Model.Operator, ['GET', 'POST', 'DELETE'])

class OrderedAction(crud.ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(OrderedAction, self).__init__(Data.Model.OrderedAction, ['GET', ])

class Action(crud.ModelCRUD):
    exposed = True
    type = base.SimpleBase([
                        {'name':'Sound'}, 
                        {'name':'Pose', 'desc':'One or more joint positions, to be set simultaneously'},
                        {'name':'Group', 'desc':'parallel actions'}, 
                        {'name':'Sequence', 'desc':'action series'},
                        ])
    _import = ActionImport()
    
    def __init__(self):
        super(Action, self).__init__(Data.Model.Action, ['GET', 'POST', 'DELETE'])
        setattr(self, 'import', Action._import)

class JointPosition(crud.ModelCRUD):
    exposed = True

    def __init__(self):
        super(JointPosition, self).__init__(Data.Model.JointPosition, ['GET', 'POST', 'DELETE'])

class Trigger(crud.ModelCRUD):
    exposed = True
    type = base.SimpleBase([
                        {'name':'Sensor'}, 
                        {'name':'Button', 'desc':'On Screen button with optional keyboard hotkeys'}, 
                        {'name':'Time', 'desc': 'Based on system clock'}, #clock should be adjusted per each users global speed setting
                        ])

    _import = TriggerImport()
    
    def __init__(self):
        super(Trigger, self).__init__(Data.Model.Trigger, ['GET', 'POST', 'DELETE'])
        setattr(self, 'import', Trigger._import)

