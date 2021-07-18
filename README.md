#  Push Pong

> Multiplayer version of the classic game _pong_ with a few unique tweaks!

https://user-images.githubusercontent.com/28553263/126052427-13097ed8-663e-4f36-8764-83244ba5b863.mp4

⚠ This project is no longer maintained.

Push Pong was once available at [pushpong.xyz](http://pushpong.xyz). _The site is now offline for cost saving purposes._


## Background

I started this project to get a better understanding of how to synchronize networked physics (netcode). This was my first fullstack application.

I wrote up a document about findings and lessons learned that can be found in the `docs/` folder of this repository.


### Summary of lessons learned

If I had to start this project again from scratch, here are some changes I would do.

#### Collision detection issues

Instead of looking for a physics engine that supports continuous collision detection to avoid situations where the ball goes through surfaces, I would at least consider the following approach.

- Set a global speed limit
- Set a high tick rate for the engine

#### Lag compensation

I would avoid any form of lag compensation. This is what I tried for this project and it's simply the wrong approach for any game where multiple players have physics interactions with a shared object (in this case, the ball). Two clients that are out of sync can never perfectly get back in sync unless movement stops (which never happens for the ball, but does for players). Worse, two clients that are already in sync can be forced out of sync because of lag compensation.

Instead, we have to take an approach called [deterministic lockstep](https://gafferongames.com/post/deterministic_lockstep/). The best explanation of how this is implemented in practice is best explained by Rocket League developers in [this talk](https://www.youtube.com/watch?v=ueEmiDM94IE).

At its core, the concept is as follows:

1. Both the clients and the server run the physics engine at a fixed tick rate (independent of framerate) and are able to store the history of states at every tick.
2. Clients send their inputs (controls) and the timestamp (tick number) to the server at every tick.
3. Clients don't wait for the server. They continue to run the physics simulation.
4. The server runs the full game as well, and receives inputs from both players.
5. The server sends a (compressed) snapshot of the full state of the physics engine at every tick (which is typically 60 times per second, but can be more). The snapshot includes the timestamp.
6. When the client receives a snapshot, it
   1. Goes back in time to that snapshot's timestamp
   2. Applies that snapshot
   3. Regenerates all the steps to catch up with its present step
   4. Redraws to the screen

This approach is pretty data-heavy for large simulated worlds, but it allows two clients who are in sync to remain in sync, and allows a client who is not in sync to become in sync.

If you're not already familiar with netcode challenges and deterministic lockstep, this explanation is still probably too vague. The document and video linked above will provide a much better explanation of the problem and solution.

#### Physics engine

For this project, I went with a JavaScript physics engine that doesn't come with baked in rendering. I spent way too much time tweaking things to make sure what was being rendered on the screen was an accurate representation of what the physics engine was reporting.

As stated in the [collision detection part](#collision-detection-issues), I wouldn't limit myself to a physics engine that has continuous collision detection, so I would probably be able to find a physics engine with a built-in renderer. This would have saved me hours of work.

As stated in the [lag compensation part](#lag-compensation), I would opt for an approach using deterministic lockstep. Since that approach is very data-heavy, I don't know if any web-based engines would really be appropriate. This approach is typically done using UDP rather than TCP, which is not something I can use in a web app.

Instead, I would make Push Pong a desktop app and look to send data via UDP. Then I would look for a mature physics engine that ideally has some built-in libraries for deterministic lockstep since it is quite a complex process to get right.m

## Contributing

⚠ This project is not actively maintained. Forks of the project are welcome, as this project published under the [MIT license](./LICENSE).

### Local development

#### Dev Requirements
- Docker
- Docker-compose
- Make

#### Run the code
From the root of the repository, run the following commands

1. `make build`
2. `make start`

The webapp will then be available at `localhost:3001`

#### Troubleshooting
If there is ever an issue with a missing import, or something works with npm locally but not using docker-compose, run the following command:

`make down`

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
