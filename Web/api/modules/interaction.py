from crud import ModelCRUD
import Data.Model
import Model.model
import cherrypy
from controller import Helper
import datetime
from ActionRunner import ActionRunner


class UserAction(object):
    exposed = True
    _runners = {}

    def __init__(self):
        pass

    @cherrypy.tools.json_out()
    def GET(self, actionId, timestamp=None):

        if actionId in UserAction._runners:
            active = UserAction._runners[actionId].isAlive()
            output = UserAction._runners[actionId].output
        else:
            active = False
            output = []

        if timestamp != None:
            pass
        else:
            pass

        output.sort(key=lambda (ts, val): ts)

        ret = {
               'id': actionId,
               'output': output,
               'active': active,
               'timestamp': Helper._utcDateTime(datetime.datetime.now()),
               }

        return ret

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, buttonId):
        data = cherrypy.request.json
        userId = data['user_id']

        button = cherrypy.request.db.query(Data.Model.Trigger).get(buttonId)
        if button is None:
            raise cherrypy.NotFound()

        action = button.action

        if action.id in UserAction._runners and UserAction._runners[action.id].isAlive():
            handle = UserAction._runners[action.id]
            handle.stop()
        else:
            robot = cherrypy.request.db.query(Data.Model.Robot).join(Model.model.Setting, Data.Model.Robot.name == Model.model.Setting.value).filter(Model.model.Setting.key == 'robot').first()
            handle = ActionRunner(robot).executeAsync(action)
            UserAction._runners[action.id] = handle

        active = handle.isAlive()
        output = [(Helper._utcDateTime(dt), msg) for (dt, msg) in handle.output]

        ret = {
               'button_id': buttonId,
               'action_id': action.id,
               'output': output,
               'active': active,
               'userId': userId,
               'timestamp': Helper._utcDateTime(datetime.datetime.now()),
        }

        return ret


class Interaction(ModelCRUD):
    exposed = True
    useraction = UserAction()

    def __init__(self):
        super(Interaction, self).__init__(Model.model.Interaction, ['GET', 'POST'])
