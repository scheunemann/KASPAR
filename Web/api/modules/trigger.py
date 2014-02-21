import crud
import Data.Model
import base
from legacy import TriggerImport
import cherrypy


class ButtonHotKey(crud.ModelCRUD):
    exposed = True

    def __init__(self):
        super(ButtonHotKey, self).__init__(Data.Model.ButtonHotKey, ['GET', 'POST', 'DELETE'])


class Trigger(crud.ModelCRUD):
    exposed = True
    type = base.SimpleBase([
                        {'name':'Sensor'},
                        {'name':'Button', 'desc':'On Screen button with optional keyboard hotkeys'},
                        {'name':'Time', 'desc': 'Based on interaction clock'},  # clock should be adjusted per each users global speed setting
                        ])

    _import = TriggerImport()
    hotkey = ButtonHotKey()
    button = crud.ModelCRUD(Data.Model.ButtonTrigger, ['GET', 'POST', 'DELETE'])
    time = crud.ModelCRUD(Data.Model.TimeTrigger, ['GET', 'POST', 'DELETE'])
    sensor = crud.ModelCRUD(Data.Model.SensorTrigger, ['GET', 'POST', 'DELETE'])

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None, **constraint):
        if oid is None and 'type' in cherrypy.request.json:
            triggerType = cherrypy.request.json['type']
            if triggerType == 'Button':
                return Trigger.button.POST(oid, **constraint)
            elif triggerType == 'Time':
                return Trigger.time.POST(oid, **constraint)
            elif triggerType == 'Sensor':
                return Trigger.sensor.POST(oid, **constraint)

        return super(Trigger, self).POST(oid, **constraint)

    def __init__(self):
        super(Trigger, self).__init__(Data.Model.Trigger, ['GET', 'POST', 'DELETE'])
        setattr(self, 'import', Trigger._import)

    def _cp_dispatch(self, vpath):
        if vpath and len(vpath) > 1:
            cherrypy.request.params['trigger_id'] = vpath.pop(0)
        if not vpath[0].isdigit():
            return getattr(self, vpath.pop(0), None)
