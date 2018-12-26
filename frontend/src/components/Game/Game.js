import React from 'react';
import Matter from 'matter-js'
import './Game.css';





class Game extends React.Component {

    async componentDidMount() {
        // module aliases
        var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;

        // create an engine
        var engine = Engine.create();

        // create a renderer
        var render = Render.create({
        element: document.getElementById("game-render"),
        engine: engine,
        options: {
            background: "#ffffff",
            height: 600,
            width: 900,
            wireframes: false
        }
        });

        console.log(render);

        // create two boxes and a ground
        var boxA = Bodies.rectangle(400, 200, 80, 80);
        var boxB = Bodies.rectangle(450, 50, 80, 80);
        var ground = Bodies.rectangle(450, 590, 910, 40, {isStatic: true});



        // add all of the bodies to the world
        World.add(engine.world, [boxA, boxB, ground]);

        // run the engine
        Engine.run(engine);

        // run the renderer
        Render.run(render)
    }

    render() {
    return (
      <div id="game-render">
          {
              //game will be rendered here.
          }
      </div>
    );
  }
}

export default Game;
