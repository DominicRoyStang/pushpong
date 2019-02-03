import {Body, Box} from "p2";
import {drawRectangle} from "../render";
import colors from "../utils/colors"

/* 
 * A boundary is a rectangular static body.
 */
export default class Boundary extends Body {
    
    constructor(props, width, height) {
        // set defaults if not specified in props
        props = Object.assign({
            angularDamping: 0,
            damping: 0,
            mass: 0
        }, props);

        // call parent constructor
        super(props);

        // add shape
        const shape = new Box({
            width: width,
            height: height
        });
        this.addShape(shape);
    }

    render = (p) => drawRectangle(p, this, colors.border);
}
