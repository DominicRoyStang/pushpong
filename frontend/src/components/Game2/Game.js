import React from "react";
import {BACKEND_URL} from "config";
import p2 from "p2";
import {Body, Circle, World} from "p2";
import P5 from "p5";

export default class Game extends React.Component {

    componentDidMount() {
        //console.log(p2);
        let world = new World();
        //console.log(world);

        // Create circle bodies
        var shape = new Circle({ radius: 0.5 });
        var body = new Body({
            mass: 1,
            position: [-11, 100],
            velocity: [1,0], // 100,0
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
                p.rect(x, y, 50, 50);
            };
        };

        let p5 = new P5(sketch, document.getElementById("game-render"));



        /* //THIS WORKS
        var timeStep = 1/60;
        setInterval(function(){
            world.step(timeStep);
            //console.log("Circle x position: " + body.position[0]);
            //console.log("Circle y position: " + body.position[1]);
            //console.log("Circle angle: " + body.angle);
        }, 1000 * timeStep);
        */

        /*
        var timeStep = 1 / 60
        var maxSubSteps = 10
        var lastTime; 
        function animate(t) {
            requestAnimationFrame(animate);
            var dt = t !== undefined && lastTime !== undefined ? t / 1000 - lastTime : 0;
            world.step(timeStep, dt, maxSubSteps); lastTime = t / 1000;
        }
        */

        
        var maxSubSteps = 10;
        var fixedTimeStep = 1 / 60;
        var lastTimeSeconds;
        function animate(t){
            requestAnimationFrame(animate);
            var timeSeconds = t / 1000;
            lastTimeSeconds = lastTimeSeconds || timeSeconds;
            var timeSinceLastCall = timeSeconds - lastTimeSeconds;
            world.step(fixedTimeStep, timeSinceLastCall, maxSubSteps);
            //renderBody(body.interpolatedPosition, body.interpolatedAngle);
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
