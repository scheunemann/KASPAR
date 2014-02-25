import cherrypy

from Robot.legacy import ActionImporter, TriggerImporter
from Data.Model import Pose, Trigger
from crud import ModelCRUD


class ActionImport(object):
    exposed = True

    def __init__(self):
        pass

    @cherrypy.tools.json_out()
    def POST(self, data=None):
        lines = data.file.readlines()
        a = ActionImporter()
        pose = a.getPose(lines)
        if pose != None:
            cherrypy.request.db.add(pose)
            cherrypy.request.db.commit()

        return pose.serialize(urlResolver=ModelCRUD._urlResolver(Pose))


class TriggerImport(object):
    exposed = True

    def __init__(self):
        pass

    @cherrypy.tools.json_out()
    def POST(self, data=None):
        lines = data.file.readlines()
        poses = cherrypy.request.db.query(Pose).all()
        t = TriggerImporter()
        triggers = t.getTriggers(lines, poses)
        if triggers != None and len(triggers) > 0:
            for trigger in triggers:
                cherrypy.request.db.add(trigger)
            cherrypy.request.db.commit()

        return [o.serialize(urlResolver=ModelCRUD._urlResolver(Trigger)) for o in triggers]
