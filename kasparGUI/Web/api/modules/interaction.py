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

def __processInteractionGame(result=None, gameId=None):
    gameId = result['id'] if result else gameId
    intId = result['interaction_id']
    if intId and gameId:
        if result and result['endTime']:
            if intId in __interactionManagers:
                __interactionManagers[intId].setTriggers([])
        else:
            if intId in __interactionManagers:
                __interactionManagers[intId].setTriggers(db_session.query(Model.Game).get(result['game_id']).triggers)
                __interactionManagers[intId].setTriggers([])


models = [
          {
            'class': Model.Interaction,
            'kwargs': {'methods':['GET', 'POST', 'PUT'], 'postprocessors': {'POST': [__processInteraction, ], 'PUT_SINGLE': [__processInteraction, ]}}
          },
          {
            'class': Model.InteractionGame,
            'kwargs': {'methods':['GET', 'POST', 'PUT'], 'postprocessors': {'POST': [__processInteractionGame, ], 'PUT_SINGLE': [__processInteractionGame, ]}}
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
    if 'trigger_id' in request.json:
        triggerId = request.json['button_id']
    else:
        raise abort(400, "Invalid JSON, missing 'trigger_id'")

    if interactionId not in __interactionManagers:
        interaction = db_session.query(Model.Interaction).get(interactionId)
        if interaction.endTime == None:
            __processInteraction(interactionId=interactionId)
        else:
            raise abort(400, "Cannot update an inactive interaction.")

    exists = db_session.query(Model.Trigger).filter(Model.Trigger.id == triggerId).count() > 0
    if not exists:
        raise abort(404, "Invalid trigger id: %s" % triggerId)

    log = __interactionManagers[interactionId].doTrigger(triggerId, True, request.json.get('source', 'OPERATOR'))

    ret = {
           'id': log.id,
           'trigger_id': log.trigger_id,
           'interaction_id': log.interaction_id,
           'timestamp': log.timestamp,
           'active': True
    }

    return jsonify(ret)
