from flask import Blueprint, jsonify, abort
from utils import DateUtil
from Web.api.database import db_session
import Model

models = [
          {
            'class': Model.Interaction,
            'kwargs': {'methods':['GET', 'POST', 'PUT'], }
          },
         ]


__interactionLog = Blueprint('interaction.log', __name__)
blueprints = [
              __interactionLog,
             ]

__interactionManagers = {}


@__interactionLog.route('/Interaction/Log/<int:interactionId>?<int:logId>?<timestamp>')
def __interactionLogGet(self, interactionId, logId=None, timestamp=None):
    if logId:
        logs = db_session.query(Model.InteractionLog).get(logId)
    else:
        logs = db_session.query(Model.InteractionLog).filter(Model.InteractionLog.interaction_id == interactionId)

    ret = []
    for log in logs:
        ret.append({
                       'id': log.id,
                       'button_id': log.trigger_id,
                       'interaction_id': log.interaction_id,
                       'timestamp': DateUtil.utcDateTime(log.timestamp),
                       'active': log.finished == None,
                    })

    return jsonify(ret[0] if logId else ret)


@__interactionLog.route('/Interaction/Log/<int:interactionId>')
def __interactionLogPost(self, interactionId):
    if 'trigger_id' in cherrypy.request.json:
        triggerId = cherrypy.request.json['trigger_id']
    else:
        raise abort(400, "Invalid JSON, missing 'trigger_id'")

    if interactionId not in __interactionManagers:
        raise abort(400, "Cannot update an inactive interaction.")

    exists = db_session.query(Model.Trigger).filter(Model.Trigger.id == triggerId).count() > 0
    if not exists:
        raise abort(404, "Invalid trigger id: %s" % triggerId)

    log = __interactionManagers[interactionId].doTrigger(triggerId)

    ret = {
           'id': log.id,
           'button_id': log.trigger_id,
           'interaction_id': log.interaction_id,
           'timestamp': DateUtil.utcDateTime(log.timestamp),
           'active': True
    }

    return jsonify(ret)
