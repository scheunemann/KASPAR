import crud
import Data.Model
import base
from legacy import TriggerImport
import cherrypy


class TimeTrigger(crud.ModelCRUD):
    exposed = True
    
    def __init__(self):
        super(TimeTrigger, self).__init__(Data.Model.TimeTrigger, ['GET', 'POST', 'DELETE'])
        
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None, **constraint):
        (data, resolveList) = self._save(oid, **constraint)
        if cherrypy.request.json.get('selfRef', False):
            data.triggers.append(data)
            cherrypy.request.db.commit()
        
        ret = data.serialize(urlResolver=self._urlResolver, resolveProps=resolveList)
        ret['selfRef'] = cherrypy.request.json.get('selfRef', False)
        return ret            
        
    @cherrypy.tools.json_out()
    def GET(self, oid=None, resolve=[], **constraint):
        ret = super(TimeTrigger, self).GET(oid, resolve, **constraint)
        ret['selfRef'] = ret['triggers']
        return ret 


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
    time = TimeTrigger()
    sensor = crud.ModelCRUD(Data.Model.SensorTrigger, ['GET', 'POST', 'DELETE'])

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None, **constraint):
        if 'type' in cherrypy.request.json:
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
