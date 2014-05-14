from flask import Flask, render_template
from flask.ext.socketio import SocketIO, send, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

__servoInterfaces = {}
__servoValues = {}
__sensorInterfaces = {}
__sensorValues = {}


@socketio.on('setData', namespace='/test')
def receiveMessage(data):
    print data


@socketio.on('configure', namespace='/test')
def configure(data):
    robotId = data['robotId']
    connect = data['connect']
    if connect:
        join_room(robotId)
    else:
        leave_room(robotId)


def sendMessage(robotId, data):
    send('getData', data, room=robotId)
