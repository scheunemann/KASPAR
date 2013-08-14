import Data.Model
from base import SimpleBase
from crud import ModelCRUD
import cherrypy
import json
import Data.Legacy

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

class Robot(ModelCRUD):
    exposed = True
    type = SimpleBase([
                        {'name':'KASPAR1a'}, 
                        {'name':'KASPAR1b'}, 
                        {'name':'KASPAR1c'},
                        ])
    servo = Servo()
    servogroup = ServoGroup()
    servoconfig = ServoConfig()
    sensor = Sensor()
    sensorgroup = SensorGroup()
    
    def _cp_dispatch(self, vpath):
        if vpath and len(vpath) > 1:
            cherrypy.request.params['constraint'] = {'robot_id': vpath.pop(0)}
        if vpath:
            return getattr(self, vpath.pop(0), None)
    
    def __init__(self):
        super(Robot, self).__init__(Data.Model.Robot, ['GET', 'POST', 'DELETE'])

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None):
        """Robot level is currently not handled properly for new robots, hacked for the time being to known versions"""
        if oid == None:
            data = Data.Legacy.KasparImporter(cherrypy.request.json['version']).getRobot()
            data.name = cherrypy.request.json['name']
            cherrypy.request.db.add(data)
            cherrypy.request.db.commit()
            return json.dumps(data.serialize())
        else:
            cur = cherrypy.request.db.query(self._modelClass).get(oid)
            if cur.version != cherrypy.request.json['version']:
                #basically have to rebuild the whole thing here
                for servoGroup in cur.servoGroups:
                    cherrypy.request.db.delete(servoGroup)

                for servo in cur.servos:
                    cherrypy.request.db.delete(servo)

                for config in cur.servoConfigs:
                    cherrypy.request.db.delete(config)
                cherrypy.request.db.commit()
                cherrypy.request.db.expunge(cur)

                data = Data.Legacy.KasparImporter(cherrypy.request.json['version']).getRobot()
                data.name = cherrypy.request.json['name']
                data.id = oid
                cherrypy.request.db.merge(data)
                return data.serialize()                
            else:
                return super(Robot, self).POST(oid)
            