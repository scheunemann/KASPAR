import cherrypy
import os
import mimetypes

class Admin(object):
    exposed = True
    title = "Admin"
    links = [("Operators", "?operation=operators"),
             ("Users", "?operation=users"),
             ("Robots", "?operation=robots"),]

    def GET(self, operation):
        if operation.lower() == "robots":
            return RobotEditor().Index()
        else:
            raise cherrypy.HTTPError(404)

class RobotEditor(object):
    
    def Index(self):
        path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../html/roboteditor.html")
        f = open(path)
        text = f.read()
        f.close()
        cherrypy.response.headers['Content-Type'] = mimetypes.guess_type(path)[0]
        return text
    
    def Data(self, arg):
        pass