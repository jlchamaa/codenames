import random
import time

with open("words.txt") as f:
    words = f.read().splitlines()


class Game:
    def __init__(self, name):
        self.name = name
        red_first = True
        self.colors = self.init_colors(red_first)
        self.selections = [False] * 25
        self.last_touched = time.time()
        self.words = random.sample(words, 25)
        self.blue = 8 if red_first else 9
        self.red = 9 if red_first else 8
        self.scores = {
            "red": [], "blue": []
        }
        self.winner = None

    def __repr__(self):
        return "Game repr"

    @staticmethod
    def init_colors(red_first):
        n = set(range(25))
        bigger = random.sample(list(n), 9)
        n -= set(bigger)
        smaller = random.sample(list(n), 8)
        n -= set(smaller)
        death = random.choice(list(n))
        prototype = ["neutral"] * 25
        big_name = "red" if red_first else "blue"
        small_name = "red" if not red_first else "blue"
        for i in bigger:
            prototype[i] = big_name
        for i in smaller:
            prototype[i] = small_name
        prototype[death] = "death"
        return prototype

    def select(self, num, clicker):
        self.last_touched = time.time()
        if self.selections[num]:
            return
        self.selections[num] = True
        color = self.colors[num]
        if color == "red":
            self.red -= 1
            if self.red == 0:
                self.winner = "red"
            self.scores["red"].append(clicker)
        if color == "blue":
            self.blue -= 1
            if self.blue == 0:
                self.winner = "blue"
            self.scores["blue"].append(clicker)
        if color == "death":
            self.winner = "blue" if clicker == "red" else "red"

    @property
    def unattended(self):
        # unattended if it hasn't been touched in an hour
        return (time.time() - self.last_touched) > 3600

    @property
    def payload(self):
        return {
            "squares": [[self.selections[n], self.colors[n], self.words[n]] for n in range(25)],
            "red": self.red,
            "blue": self.blue,
            "winner": self.winner,
            "name": self.name,
            "scores": self.scores,
        }
