import cherrypy
import Data.Model
from base import SimpleBase
from crud import ModelCRUD
from robot import Servo, ServoGroup, ServoConfig, Sensor, SensorGroup
from user import CustomAction, CustomTrigger

class Operator(ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(Operator, self).__init__(Data.Model.Operator, ['GET', 'POST', 'DELETE'])

class Robot(ModelCRUD):
    exposed = True
    types = SimpleBase([
                        {'name':'KASPAR 1a'}, 
                        {'name':'KASPAR 1b'}, 
                        {'name':'KASPAR 1c'},
                        ])
    servo = Servo()
    servogroup = ServoGroup()
    servoconfig = ServoConfig()
    sensor = Sensor()
    sensorgroup = SensorGroup()
    
    def _cp_dispatch(self, vpath):
        if vpath:
            cherrypy.request.params['constraint'] = {'robot_id': vpath.pop(0)}
        if vpath:
            return getattr(self, vpath.pop(0), None)
    
    def __init__(self):
        super(Robot, self).__init__(Data.Model.Robot, ['GET', 'POST', 'DELETE'])

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
    
class Action(ModelCRUD):
    exposed = True
    types = SimpleBase([
                        {'name':'Sound'}, 
                        {'name':'Pose', 'desc':'One or more joint positions, to be set simultaneously'},
                        {'name':'Group', 'desc':'parallel actions'}, 
                        {'name':'Sequence', 'desc':'action series'},
                        ])
    
    def __init__(self):
        super(Action, self).__init__(Data.Model.Action, ['GET', 'POST', 'DELETE'])

class Joint(ModelCRUD):
    exposed = True

    def __init__(self):
        super(Joint, self).__init__(Data.Model.Joint, ['GET', 'POST', 'DELETE'])

class Trigger(ModelCRUD):
    exposed = True
    types = SimpleBase([
                        {'name':'Sensor'}, 
                        {'name':'Button', 'desc':'On Screen button with optional keyboard hotkeys'}, 
                        {'name':'Time', 'desc': 'Based on system clock'}, #clock should be adjusted per each users global speed setting
                        ])

    def __init__(self):
        super(Trigger, self).__init__(Data.Model.Trigger, ['GET', 'POST', 'DELETE'])

