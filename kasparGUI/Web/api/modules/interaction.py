from flask import Blueprint, jsonify, abort, request
from kasparGUI.Web.api.database import db_session
from kasparGUI.Web.api.interactionManager import InteractionManager
import kasparGUI.Model as Model

__interactionLog = Blueprint('interaction.log', __name__)
blueprints = [
              __interactionLog,
             ]

__interactionManagers = {}


def __processInteraction(result=None, interactionId=None):
    intId = result['id'] if result else interactionId
    if intId:
        if result and result['endTime']:
            if intId in __interactionManagers:
                __interactionManagers[result['id']].stop()
                __interactionManagers.pop(result['id'], None)
        else:
            __interactionManagers[intId] = InteractionManager(intId)
            __interactionManagers[intId].start()


models = [
          {
            'class': Model.Interaction,
            'kwargs': {'methods':['GET', 'POST', 'PUT'], 'postprocessors': {'POST': [__processInteraction, ], 'PUT_SINGLE': [__processInteraction, ]}}
          },
         ]


@__interactionLog.route('/Interaction/<int:interactionId>/Log', defaults={'logId': None, 'timestamp': None}, methods=['GET'])
@__interactionLog.route('/Interaction/<int:interactionId>/Log/<int:logId>', defaults={'timestamp': None}, methods=['GET'])
@__interactionLog.route('/Interaction/<int:interactionId>/Log/<int:logId>?<timestamp>', methods=['GET'])
def __interactionLogGet(interactionId, logId=None, timestamp=None):
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
                       'timestamp': log.timestamp,
                       'active': log.finished == None,
                    })

    return jsonify(ret[0] if logId else ret)


@__interactionLog.route('/Interaction/<int:interactionId>/Log', methods=['POST'])
def __interactionLogPost(interactionId):
    if 'button_id' in request.json:
        triggerId = request.json['button_id']
    else:
        raise abort(400, "Invalid JSON, missing 'button_id'")

    if interactionId not in __interactionManagers:
        interaction = db_session.query(Model.Interaction).get(interactionId)
        if interaction.endTime == None:
            __processInteraction(interactionId=interactionId)
        else:
            raise abort(400, "Cannot update an inactive interaction.")

    exists = db_session.query(Model.Trigger).filter(Model.Trigger.id == triggerId).count() > 0
    if not exists:
        raise abort(404, "Invalid trigger id: %s" % triggerId)

    log = __interactionManagers[interactionId].doTrigger(triggerId, True)

    ret = {
           'id': log.id,
           'button_id': log.trigger_id,
           'interaction_id': log.interaction_id,
           'timestamp': log.timestamp,
           'active': True
    }

    return jsonify(ret)
