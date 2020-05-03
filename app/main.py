from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room
from server import Server
app = Flask(__name__)
socketio = SocketIO(app)
server = Server()


@socketio.on('join')
def on_join(data):
    print("We got a joiner!")
    room = data["server"].lower()
    server.new_game(room)
    join_room(room)
    refresh_all(room)


@socketio.on('leave')
def leave_me_alone(data):
    print("We're leaving")
    room = data["server"].lower()
    leave_room(room)


def refresh_all(room):
    game = server.get_game(room)
    if game is not None:
        emit("refresh", game.payload, room=room)


@socketio.on('select')
def select_box(data):
    box = int(data["selection"])
    clicker = data["clicker"]
    room = data["server"]
    server.get_game(room).select(box, clicker)
    refresh_all(room)


@app.route('/', methods=['GET'])
def hello():
    return render_template("main.html")


if __name__ == "__main__":
    # Only for debugging while developing
    socketio.run(app, host='0.0.0.0', debug=True, port=1879)
