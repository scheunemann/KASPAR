from flask import Blueprint, jsonify, abort, redirect
from kasparGUI.legacyImporter import TriggerImporter
import kasparGUI.Model as Model
from kasparGUI.Web.api.database import db_session

models = [
          {'class': Model.Trigger, 'kwargs': {'include_columns': ['id', 'name', 'type']}},
          {'class': Model.SensorTrigger, },
          {'class': Model.TimeTrigger, },
          {'class': Model.CompoundTrigger, },
          {'class': Model.ButtonTrigger, },
          {'class': Model.ButtonHotkey, },
         ]

__types = Blueprint('trigger.type', __name__)
__test = Blueprint('trigger.test', __name__)
__importer = Blueprint('trigger.import', __name__)
blueprints = [
              __types,
              __test
             ]

__triggerTypes = [
            {'id': 1, 'name': 'SensorTrigger', 'disp': 'Sensor'},
            {'id': 2, 'name': 'ButtonTrigger', 'disp': 'Button', 'desc': 'On Screen button with optional keyboard hotkeys'},
            {'id': 3, 'name': 'TimeTrigger', 'disp': 'Time', 'desc': 'Based on interaction clock'},  # clock should be adjusted per each users global speed setting
            {'id': 4, 'name': 'CompoundTrigger', 'disp': 'Compound', 'desc': 'Combination of multiple triggers'},  # clock should be adjusted per each users global speed setting
        ]


@__types.route('/TriggerType', methods=['GET'])
@__types.route('/TriggerType/<int:id_>', methods=['GET'])
def typesGet(id_=None):
    if id_:
        ret = [a for a in __triggerTypes if a['id'] == id_]
        if ret == None:
            abort(404)
        else:
            ret = ret[0]
    else:
        ret = {'num_results': len(__triggerTypes), 'objects': __triggerTypes, 'page': 1, 'total_pages': 1}
    return jsonify(ret)


@__importer.route('/Trigger/Import', methods=['POST'])
def importPost(self, data=None):
    lines = data.file.readlines()
    poses = db_session.query(Model.PoseAction).all()
    t = TriggerImporter()
    triggers = t.getTriggers(lines, poses)
    if triggers != None and len(triggers) > 0:
        for trigger in triggers:
            db_session.add(trigger)
        db_session.commit()

    url = '/Trigger/id=%s' % [t.id for d in triggers]
    return redirect(url)
