import cherrypy
import json

import Robot.legacy
import Data.Model
from crud import ModelCRUD


class ServoModel(ModelCRUD):
    exposed = True

    def __init__(self):
        super(ServoModel, self).__init__(Data.Model.ServoModel, ['GET', ])


class Servo(ModelCRUD):
    exposed = True
    model = ServoModel()

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


class SensorModel(ModelCRUD):
    exposed = True

    def __init__(self):
        super(SensorModel, self).__init__(Data.Model.SensorModel, ['GET', ])


class SensorValueType(ModelCRUD):
    exposed = True

    def __init__(self):
        super(SensorValueType, self).__init__(Data.Model.SensorValueType, ['GET', ])


class Sensor(ModelCRUD):
    exposed = True
    model = SensorModel()
    valuetype = SensorValueType()

    def __init__(self):
        super(Sensor, self).__init__(Data.Model.Sensor, ['GET', 'POST', 'DELETE'])


class SensorGroup(ModelCRUD):
    exposed = True

    def __init__(self):
        super(SensorGroup, self).__init__(Data.Model.SensorGroup, ['GET', 'POST', 'DELETE'])


class SensorConfig(ModelCRUD):
    exposed = True

    def __init__(self):
        super(SensorConfig, self).__init__(Data.Model.SensorConfig, ['GET', 'POST', 'DELETE'])


class RobotModel(ModelCRUD):
    exposed = True

    def __init__(self):
        super(RobotModel, self).__init__(Data.Model.RobotModel, ['GET', ])


class Robot(ModelCRUD):
    exposed = True
    model = RobotModel()
    servo = Servo()
    servogroup = ServoGroup()
    servoconfig = ServoConfig()
    sensor = Sensor()
    sensorgroup = SensorGroup()
    sensorconfig = SensorConfig()

    def _cp_dispatch(self, vpath):
        if vpath and len(vpath) > 1:
            cherrypy.request.params['robot_id'] = vpath.pop(0)
        if not vpath[0].isdigit():
            return getattr(self, vpath.pop(0), None)

    def __init__(self):
        super(Robot, self).__init__(Data.Model.Robot, ['GET', 'POST', 'DELETE'])

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None, **constraint):
        """Robot level is currently not handled properly for new robots, hacked for the time being to known versions"""
        if oid == None:
            data = Robot.legacy.KasparImporter(cherrypy.request.json['version']).getRobot()
            data.name = cherrypy.request.json['name']
            cherrypy.request.db.add(data)
            cherrypy.request.db.commit()
            return json.dumps(data.serialize())
        else:
            cur = cherrypy.request.db.query(self._modelClass).get(oid)
            if cur.version != cherrypy.request.json['version']:
                # basically have to rebuild the whole thing here
                for servoGroup in cur.servoGroups:
                    cherrypy.request.db.delete(servoGroup)

                for servo in cur.servos:
                    cherrypy.request.db.delete(servo)

                for config in cur.servoConfigs:
                    cherrypy.request.db.delete(config)
                cherrypy.request.db.commit()
                cherrypy.request.db.expunge(cur)

                try:
                    data = Config.legacy.KasparImporter(cherrypy.request.json['version']).getRobot()
                    data.name = cherrypy.request.json['name']
                    data.id = oid
                    cherrypy.request.db.merge(data)
                    return data.serialize(urlResolver=self._urlResolver)
                except Exception:
                    raise cherrypy.HTTPError("Unknown version string")
            else:
                return super(Robot, self).POST(oid)
