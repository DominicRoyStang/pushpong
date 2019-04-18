import {Body, Convex} from "p2";
import {canvasHeight, paddleHeight} from "../../utils/dimensions";
import {drawConvex} from "../../render";
import colors from "../../utils/colors";
import {groups, masks} from "../../utils/collisions";

/*
 * A bumper is the front part of a player that is used to push the ball. It is attached to a paddle via springs.
 */
export default class RectangularBumper extends Body {
    constructor(props) {
        // set defaults if not specified in props
        props = Object.assign({
            angularDamping: 0,
            damping: 0,
            fixedRotation: true,
            mass: 1,
        }, props);

        // call parent constructor
        super(props);

        // dimensions
        const width = canvasHeight/5;
        const height = paddleHeight*2;
        
        // add bumper
        const bumper = new Convex({
            collisionGroup: groups.bumpers,
            collisionMask: masks.defaultMask,
            vertices: [[width/2, 0], [width/2, height], [-width/2, height], [-width/2, 0]]
        });
        this.addShape(bumper);
    }

    render = (p) => drawConvex(p, this, colors.bumper1);
}