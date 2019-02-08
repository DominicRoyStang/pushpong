import {Body, Box} from "p2";
import {drawRectangle} from "../render";
import colors from "../utils/colors";
import {groups, masks} from "../utils/collisions";

/* 
 * A boundary is a rectangular static body.
 */
export default class Boundary extends Body {
    
    constructor(props, width, height, group = groups.defaultGroup, mask = masks.defaultMask) {
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
            collisionGroup: group,
            collisionMask: mask,
            width: width,
            height: height
        });
        this.addShape(shape);
    }

    render = (p) => drawRectangle(p, this, colors.border);
}
