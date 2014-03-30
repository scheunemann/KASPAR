import crud
import Data.Model
import base
from legacy import TriggerImport
import cherrypy


class ButtonHotkey(crud.ModelCRUD):
    exposed = True

    def __init__(self):
        super(ButtonHotkey, self).__init__(Data.Model.ButtonHotkey, ['GET', 'POST', 'DELETE'])


class Trigger(crud.ModelCRUD):
    exposed = True
    type = base.SimpleBase([
                        {'name':'Sensor'},
                        {'name':'Button', 'desc':'On Screen button with optional keyboard hotkeys'},
                        {'name':'Time', 'desc': 'Based on interaction clock'},  # clock should be adjusted per each users global speed setting
                        {'name':'Compound', 'desc': 'Combination of multiple triggers'},  # clock should be adjusted per each users global speed setting
                        ])

    _import = TriggerImport()
    hotkey = ButtonHotkey()

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, oid=None, **constraint):
        if 'type' in cherrypy.request.json:
            triggerType = cherrypy.request.json['type']

        return super(Trigger, self).POST(oid, **constraint)

    def __init__(self):
        super(Trigger, self).__init__(Data.Model.Trigger, ['GET', 'POST', 'DELETE'])
        setattr(self, 'import', Trigger._import)

    def _save(self, oid, **constraint):
        triggerType = cherrypy.request.json['type']
        if triggerType == 'Button':
            modelClass = Data.Model.ButtonTrigger
        elif triggerType == 'Time':
            modelClass = Data.Model.TimeTrigger
        elif triggerType == 'Sensor':
            modelClass = Data.Model.SensorTrigger
        elif triggerType == 'Compound':
            modelClass = Data.Model.CompoundTrigger
        else:
            raise cherrypy.HTTPError(500, "Unknown trigger class %s" % triggerType)

        (data, resolveList) = modelClass.deserialize(modelClass, cherrypy.request.json, cherrypy.request.db)
        try:
            if data.id == None:
                # New object
                cherrypy.request.db.add(data)
            else:
                cherrypy.request.db.merge(data)
        except Exception as ex:
            raise cherrypy.HTTPError(500, ex)

        cherrypy.request.db.commit()

        return (data, resolveList)

    def _cp_dispatch(self, vpath):
        if vpath and len(vpath) > 1:
            cherrypy.request.params['trigger_id'] = vpath.pop(0)
        if not vpath[0].isdigit():
            return getattr(self, vpath.pop(0), None)
