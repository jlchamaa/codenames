import random
import time


class Game:
    def __init__(self):
        self.colors = self.init_colors(True)
        self.selections = [False] * 25
        self.last_touched = time.time()

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

    def select(self, num):
        self.last_touched = time.time()
        self.selections[num] = True

    @property
    def unattended(self):
        # unattended if it hasn't been touched in an hour
        return (time.time() - self.last_touched) > 3600

    @property
    def payload(self):
        return {"selected": self.selections, "colors": self.colors}
