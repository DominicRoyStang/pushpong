import React from "react";
import ReactDOM from "react-dom";
import {BACKEND_URL} from "config";
import p2 from "p2";
import p5 from "p5";

export default class Game extends React.Component {

    componentDidMount() {
        console.log("P2 component did mount.");

        //console.log(p2);
        console.log(p5);

        const sketch = (p) => {
            let x = 100;
            let y = 100;

            p.setup = () => {
                p.createCanvas(900, 600);
            };

            p.draw = () => {
                p.background(255);
                p.fill(0);
                p.rect(x, y, 50, 50);
            };
          };

        let P5 = new p5(sketch, document.getElementById("game-render"));
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
