from user import User
import Data.Model
import base
import controller
import crud
from legacy import ActionImport, TriggerImport
from robot import Robot
import cherrypy

__all__ = ['Operator', 'Robot', 'User', 'Action', 'Joint', 'Trigger', 'RobotInterface', 'ServoInterface']

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
    test = controller.ActionTest()
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
        
    #TODO: Action type on new actions
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None, **constraint):
        return super(Action, self).POST(oid, **constraint)

    def _cp_dispatch(self, vpath):
        if vpath and len(vpath) > 1:
            cherrypy.request.params['actionId'] = vpath.pop(0)
        if not vpath[0].isdigit():
            return getattr(self, vpath.pop(0), None)
        
class JointPosition(crud.ModelCRUD):
    exposed = True

    def __init__(self):
        super(JointPosition, self).__init__(Data.Model.JointPosition, ['GET', 'POST', 'DELETE'])

class Trigger(crud.ModelCRUD):
    exposed = True
    type = base.SimpleBase([
                        {'name':'Sensor'},
                        {'name':'Button', 'desc':'On Screen button with optional keyboard hotkeys'},
                        {'name':'Time', 'desc': 'Based on system clock'},  # clock should be adjusted per each users global speed setting
                        ])

    _import = TriggerImport()

    def __init__(self):
        super(Trigger, self).__init__(Data.Model.Trigger, ['GET', 'POST', 'DELETE'])
        setattr(self, 'import', Trigger._import)

class RobotInterface(controller.RobotInterface):
    exposed = True

    @property
    def links(self):
        return []

    @property
    def title(self):
        return self._modelClass.__name__

class ServoInterface(controller.ServoInterface):
    exposed = True

    @property
    def links(self):
        return []

    @property
    def title(self):
        return self._modelClass.__name__
