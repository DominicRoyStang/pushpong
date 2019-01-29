import React from "react";
import {BACKEND_URL} from "config";
import p2 from "p2";
import {Body, Circle, World} from "p2";
import P5 from "p5";

export default class Game extends React.Component {

    componentDidMount() {
        //console.log(p2);
        let world = new World({
            //gravity: [0, 0]
        });
        console.log(world);

        // Create circle bodies
        let shape = new Circle({ radius: 10 });
        let body = new Body({
            mass: 1,
            position: [450, 300],
            //velocity: [1,0], // 100,0
            ccdSpeedThreshold: 0 // -1
        });
        body.addShape(shape);
        world.addBody(body);

        const sketch = (p) => { // TODO: Move sketch to its own file; import it here.
            let x;
            let y;

            p.setup = () => {
                p.createCanvas(900, 600);
            };

            p.draw = () => {
                p.background(255);
                p.fill(0);
                [x, y] = body.interpolatedPosition;
                //p.rect(x, y, 50, 50);
                // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
                // whereas p2 (physics) uses the top right corner as (0,0)
                p.circle(x, 600-y, 10);
            };
        };

        let p5 = new P5(sketch, document.getElementById("game-render"));

        this.runEngine(world);
    }

    runEngine(world) {
        let maxSubSteps = 10;
        let fixedTimeStep = 1 / 60;
        let lastTimeSeconds;
        const animate = (t) => {
            requestAnimationFrame(animate);
            const timeSeconds = t / 1000;
            lastTimeSeconds = lastTimeSeconds || timeSeconds;
            const timeSinceLastCall = timeSeconds - lastTimeSeconds;
            world.step(fixedTimeStep, timeSinceLastCall, maxSubSteps);
        }
        requestAnimationFrame(animate);
    }

    render() {
        return (
            <div id="game-render" tabIndex="0">
                {
                    //game will be rendered here when the component mounts.
                }
            </div>
        );
    }
}
