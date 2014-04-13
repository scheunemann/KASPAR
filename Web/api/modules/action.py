import datetime
from flask import Blueprint, jsonify, abort, request, redirect
from Robot.legacy import ActionImporter
from ActionRunner import ActionRunner
import Model


models = [
          {'class': Model.JointPosition, },
          {'class': Model.SequenceOrder, },
          {'class': Model.Action, 'kwargs': {'include_columns': ['id', 'name', 'type', ]}},
          {'class': Model.SoundAction, },
          {'class': Model.PoseAction, },
          {'class': Model.ExpressionAction, },
          {'class': Model.SequenceAction, },
          {'class': Model.GroupAction, },
         ]

__types = Blueprint('action.type', __name__)
__test = Blueprint('action.test', __name__)
__importer = Blueprint('action.import', __name__)
blueprints = [
                  __types,
                  __test,
                  __importer,
              ]

__actionTypes = [
    {'id': 1, 'name': 'SoundAction', 'disp': 'Sound'},
    {'id': 2, 'name': 'PoseAction', 'disp': 'Pose', 'desc': 'One or more joint positions, to be set simultaneously'},
    {'id': 3, 'name': 'GroupAction', 'disp': 'Group', 'desc': 'parallel actions'},
    {'id': 4, 'name': 'SequenceAction', 'disp': 'Sequence', 'desc': 'action series'},
]


@__types.route('/ActionType', methods=['GET'])
@__types.route('/ActionType/<int:id_>', methods=['GET'])
def typesGet(id_=None):
    if id_:
        ret = [a for a in __actionTypes if a['id'] == id_]
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


@__test.route('/Action/Test/<int:oid>?<timestamp>', methods=['GET'])
def testGet(self, oid=None, timestamp=None):
    if oid in __testRunners:
        active = __testRunners[oid].isAlive()
        output = __testRunners[oid].output
    else:
        active = False
        output = []

    if timestamp != None:
        pass
    else:
        pass

    output.sort(key=lambda (ts, val): ts)

    ret = {
           'id': oid,
           'output': output,
           'active': active,
           'timestamp': datetime.datetime.utcnow(),
           }

    return ret


@__test.route('/Action/Test/<int:oid>', methods=['POST'])
def testPost(self, oid):
    if oid in __testRunners and __testRunners[oid].isAlive():
        handle = __testRunners[oid]
        handle.stop()
    else:
        action = db_session.query(Model.Action).get(oid)
        # TODO: Robot selection
        robot = db_session.query(Model.Robot).filter(Model.Robot.name == 'Kaspar_1C - #2').first()
        handle = ActionRunner(robot).executeAsync(action)
        __testRunners[oid] = handle

    active = handle.isAlive()
    output = handle.output

    ret = {
           'id': oid,
           'output': [(o[0].isoformat(), o[1]) for o in output],
           'active': active,
           'timestamp': datetime.datetime.utcnow().isoformat(),
    }

    return ret
