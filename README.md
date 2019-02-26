# Project Description
**Push Pong** is a multiplayer version of the classic game _pong_ that has a few unique tweaks!
Try it out now at  [pushpong.xyz](http://www.pushpong.xyz)

# Requirements
- A modern web browser

# Dev Requirements
- Docker
- Docker-compose

# Run the code
`docker-compose --file docker-compose.yaml up --build`

# Troubleshooting
If there is ever an issue with a missing import, or something works with npm locally but not using docker-compose, run the following command
`docker-compose --file docker-compose.yaml down -v`
