
import {Body, Box} from "p2";
import {canvasHeight, paddleBoundSpacing} from "../utils/dimensions"
import {drawRectangle} from "../render";

/* 
 * A boundary is a rectangular static body.
 */

export default class Player extends Body {
    
    constructor(props) {
        // set defaults if not specified in props
        props = Object.assign({
            angle: Math.PI/2,
            angularDamping: 0,
            damping: 0,
            fixedRotation: true,
            fixedX: true,
            mass: 1
        }, props);

        // call parent constructor
        super(props);

        const width = canvasHeight/5;
        const paddleHeight = paddleBoundSpacing;
        const bumperHeight = paddleHeight*2;
        const springLength = paddleHeight + bumperHeight/2;
        
        // add shape
        const shape = new Box({
            width: width,
            height: paddleHeight
        });
        this.addShape(shape);
    }

    render = (p) => drawRectangle(p, this);
}
