# codenames

[![GoDoc](https://godoc.org/github.com/jbowens/codenames?status.svg)](https://godoc.org/github.com/jbowens/codenames)
Codenames implements a web app for generating and displaying boards for the <a href="https://en.wikipedia.org/wiki/Codenames_(board_game)">Codenames</a> board game. Generated boards are shareable and will update as words are revealed. The board can be viewed either as a spymaster or an ordinary player.

### Docker

Alternatively, the reposotiry includes a Dockerfile for building a docker image of this app.

```
docker build . -t codenames:latest
```

The following command will launch the docker image:

```
docker run --name codenames_server --rm -p 9091:9091 -d codenames
```

The following command will kill the docker instance:

```
docker stop codenames_server
```
