import {Body, Circle} from "p2";
import {drawCircle} from "../render";

/* 
 * A ball is a circular dynamic body.
 */

export default class Ball extends Body {
    
    constructor(props, radius = 10) {
        // set defaults if not specified in props
        props = Object.assign({
            angularDamping: 0,
            ccdSpeedThreshold: 0,
            damping: 0,
            mass: 1
        }, props);

        // call parent constructor
        super(props);
        
        // add shape
        const shape = new Circle({
            radius: radius
        });
        this.addShape(shape);
    }

    render = (p) => drawCircle(p, this);
}
