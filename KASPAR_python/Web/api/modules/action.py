from Data.Legacy import ActionImporter
import cherrypy

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
            
        return pose.serialize()