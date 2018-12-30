import React from 'react';
import {Engine, Render, World, Bodies} from 'matter-js'
import './Game.css';

export default class Game extends React.Component {

    async componentDidMount() {
        // create the engine
        this.engine = Engine.create();

        //create the renderer
        this.render = Render.create({
            element: document.getElementById("game-render"), //attaches game canvas to the div#game-render HTML element
            engine: this.engine,
            options: {
                background: "#ffffff",
                height: 600,
                width: 900,
                wireframes: false
            }
        });

        this.createWorld();

        this.run();
    }

    createWorld() {
        // create two boxes and a ground
        let boxA = Bodies.rectangle(400, 200, 80, 80);
        let boxB = Bodies.rectangle(450, 50, 80, 80);
        let boxC = Bodies.rectangle(350, 100, 50, 50, {
            render: {
                fillStyle: 'white',
                strokeStyle: 'blue',
                lineWidth: 3,
            }
        });
        boxA.restitution = 0.9;
        boxB.restitution = 0.9;
        boxC.restitution = 0.9;
        console.log(boxC)
        let ground = Bodies.rectangle(450, 590, 910, 40, {isStatic: true});

        // add all of the bodies to the world
        World.add(this.engine.world, [boxA, boxB, boxC, ground]);
    }

    run() {
        // run the engine
        Engine.run(this.engine);

        // run the renderer
        Render.run(this.render)
    }

    render() {
    return (
      <div id="game-render">
          {
              //game will be rendered here when the component mounts.
          }
      </div>
    );
  }
}
