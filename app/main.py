from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room
from server import Server
app = Flask(__name__)
socketio = SocketIO(app)
server = Server()


@socketio.on('join')
def on_join(data):
    print("We got a joiner!")
    room = data["server"]
    server.new_game(room)
    join_room(room)
    refresh_all(room)


def refresh_all(room):
    game = server.get_game(room)
    if game is not None:
        emit("refresh", game.payload, room=room)


def select_box(room, box):
    game = server.get_game(room)
    game.select(box)


@socketio.on('select')
def my_event_handler(data):
    box = int(data["selection"])
    room = data["server"]
    select_box(room, box)
    refresh_all(room)


@app.route('/', methods=['GET'])
def hello():
    return render_template("main.html")
# game_id, resp = start_game(args)
# if resp == 200:
#     return redirect("/game/" + game_id)
# else:
#     return "Something went wrong", 404


def start_game(args):
    if "game" not in args:
        return "Didn't get a game id", 400
    if "name" not in args:
        return "Didn't get a name", 400
    server.new_game(args["game"])
    return args["game"], 200


if __name__ == "__main__":
    # Only for debugging while developing
    socketio.run(app, host='0.0.0.0', debug=True, port=8080)
