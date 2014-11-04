import datetime 
from flask import Blueprint, jsonify, abort, request, redirect 
from kasparGUI.legacyImporter import ActionImporter 
from robotActionController.ActionRunner import ActionManager, ActionRunner
from robotActionController.Robot import Robot 
from kasparGUI.Web.api.database import db_session 
import kasparGUI.Model as Model


models = [
          {'class': Model.JointPosition, },
          {'class': Model.SequenceOrder, },
          {'class': Model.Action, 'kwargs': {'include_columns': ['id', 'name', 'type', ]}},
          {'class': Model.SoundAction, },
          {'class': Model.PoseAction, },
          {'class': Model.SequenceAction, 'kwargs': {'exclude_columns': []}},
          {'class': Model.GroupAction, },
         ]

__types = Blueprint('action.type', __name__)
__test = Blueprint('action.test', __name__)
__importer = Blueprint('action.import', __name__)
__soundData = Blueprint('sound.data', __name__)
blueprints = [
                  __types,
                  __test,
                  __importer,
                  __soundData,
              ]

__actionTypes = [
    {'id': 1, 'name': 'SoundAction', 'disp': 'Sound'},
    {'id': 2, 'name': 'PoseAction', 'disp': 'Pose', 'desc': 'One or more joint positions, to be set simultaneously'},
    {'id': 3, 'name': 'GroupAction', 'disp': 'Group', 'desc': 'parallel actions'},
    {'id': 4, 'name': 'SequenceAction', 'disp': 'Sequence', 'desc': 'action series'},
]


@__soundData.route('/SoundData', methods=['POST'])
def postSoundData():
    if 'sound' in request.files:
        soundFile = request.files['sound']
        uuid = Model.SoundAction.saveData(soundFile.read())
        if uuid:
            ret = {'uuid': uuid}
            return jsonify(ret)
        else:
            abort(500, msg='Error occured while saving')
    abort(400, msg='No sound file attached')


@__types.route('/ActionType', methods=['GET'])
@__types.route('/ActionType/<int:aid>', methods=['GET'])
def typesGet(aid=None):
    if aid:
        ret = [a for a in __actionTypes if a['id'] == aid]
        if ret == None:
            abort(404)
        else:
            ret = ret[0]
    else:
        ret = {'num_results': len(__actionTypes), 'objects': __actionTypes, 'page': 1, 'total_pages': 1}
    return jsonify(ret)


@__importer.route('/Action/Import', methods=['POST'])
def importPost():
    lines = request.files['file'].readlines()
    a = ActionImporter()
    pose = a.getPose(lines)
    if pose != None:
        db_session.add(pose)
        db_session.commit()

    url = '/Action/%s' % pose.id
    return redirect(url)


__testRunners = {}


@__test.route('/Action/<int:aid>/Test', methods=['GET'])
def testGet(aid=None, timestamp=None):
    if aid in __testRunners:
        active = bool(__testRunners[aid])
        output = __testRunners[aid].output
    else:
        active = False
        output = []

    if timestamp != None:
        pass
    else:
        pass

    output.sort(key=lambda (ts, val): ts)

    ret = {
           'id': aid,
           'output': output,
           'active': active,
           'timestamp': datetime.datetime.utcnow(),
           }

    return jsonify(ret)


@__test.route('/Action/<int:aid>/Test', methods=['POST'])
def testPost(aid):
    if aid in __testRunners and bool(__testRunners[aid]):
        handle = __testRunners[aid]
        handle.kill()
        handle.join(1)
    action = db_session.query(Model.Action).get(aid)
    if not action:
        abort(400, msg='Action not found')
        
    robotName = db_session.query(Model.Setting).filter(Model.Setting.key == 'robot').first()
    robot = db_session.query(Model.Robot).filter(Model.Robot.name == robotName.value).first()
    r = Robot.getRunnableRobot(robot)
    m = ActionManager.getManager(r)
    a = ActionRunner.getRunable(action) #We don't want these cached
    handle = m.executeActionAsync(a)
    __testRunners[aid] = handle

    active = bool(handle)
    output = handle.output

    ret = {
           'id': aid,
           'output': [(o[0].isoformat(), o[1]) for o in output],
           'active': active,
           'timestamp': datetime.datetime.utcnow().isoformat(),
    }

    return jsonify(ret)
