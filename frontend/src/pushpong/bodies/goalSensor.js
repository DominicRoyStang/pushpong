import {Body, Plane} from "p2";
import {drawLine} from "../render";
import colors from "../utils/colors";
import {groups, masks} from "../utils/collisions";

/* 
 * A GoalSensor is a plane that detects collisions with the ball.
 */
export default class GoalSensor extends Body {

    constructor(props, onContact = () => {}, group = groups.defaultGroup, mask = masks.defaultMask) {
        // set defaults if not specified in props
        props = Object.assign({
            angle: Math.PI/2,
            angularDamping: 0,
            collisionResponse: false,
            damping: 0,
            mass: 0
        }, props);

        // call parent constructor
        super(props);

        // add shape
        const shape = new Plane({
            collisionGroup: group,
            collisionMask: mask,
            sensor: true
        });
        this.addShape(shape);
    }

    render = (p) => drawLine(p, this, colors.border);
}
