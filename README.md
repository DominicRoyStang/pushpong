# Project Description
**Push Pong** is a multiplayer version of the classic game _pong_ that has a few unique tweaks!

This project was once available at [pushpong.xyz](http://pushpong.xyz)

_The site is currently **OFFLINE** for cost saving purposes._

# Requirements
- A modern web browser

# Dev Requirements
- Docker
- Docker-compose
- Make

# Run the code
From the root of the repository, run the following commands

1. `make build`
2. `make start`

The webapp will then be available at `localhost:3001`

# Troubleshooting
If there is ever an issue with a missing import, or something works with npm locally but not using docker-compose, run the following command:

`make down`
