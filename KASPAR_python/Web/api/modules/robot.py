import Data.Model
from base import SimpleBase
from crud import ModelCRUD

class Servo(ModelCRUD):
    exposed = True
    types = SimpleBase(['AX12', ])
    
    def __init__(self):
        super(Servo, self).__init__(Data.Model.Servo, ['GET', 'POST', 'DELETE'])
    
class ServoGroup(ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(ServoGroup, self).__init__(Data.Model.ServoGroup, ['GET', 'POST', 'DELETE'])
        
class ServoConfig(ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(ServoConfig, self).__init__(Data.Model.ServoConfig, ['GET', 'POST', 'DELETE'])
        
class Sensor(ModelCRUD):
    exposed = True
    types = SimpleBase(['Clock', 'FSR', ])
    
    def __init__(self):
        super(Sensor, self).__init__(Data.Model.Sensor, ['GET', 'POST', 'DELETE'])
        
class SensorGroup(ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(SensorGroup, self).__init__(Data.Model.Servo, ['GET', 'POST', 'DELETE'])
