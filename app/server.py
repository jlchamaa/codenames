from game import Game


class Server:
    def __init__(self):
        self.games = {}

    def __repr__(self):
        return self.games

    def new_game(self, name):
        if name not in self.games:
            self.games[name] = Game()

    def cull_games(self):
        for name, game in self.games.values():
            if game.unattended:
                del self.games[name]

    def get_game(self, name):
        return self.games.get(name, None)
