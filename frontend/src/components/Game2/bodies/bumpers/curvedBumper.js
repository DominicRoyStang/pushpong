import {Body, Convex} from "p2";
import Bezier from "bezier-js";
import {canvasHeight, paddleHeight} from "../../utils/dimensions"
import {drawConvex} from "../../render";
import colors from "../../utils/colors";
import {groups, masks} from "../../utils/collisions";

/*
 * A bumper is the front part of a player that is used to push the ball. It is attached to a paddle via springs.
 */
export default class CurvedBumper extends Body {
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
        const height = paddleHeight*3;

        const curve = new Bezier(width/2, paddleHeight, width/4, height, -width/4, height, -width/2, paddleHeight);
        let lookUpTable = curve.getLUT(16);
        //console.log(lut);
        const vertices = [[width/2, 0]];
        for (const {x, y} of lookUpTable) {
            vertices.push([x, y])
        }

        vertices.push([-width/2, 0])
        
        // add bumper
        const bumper = new Convex({
            collisionGroup: groups.defaultGroup,
            collisionMask: masks.defaultMask,
            vertices: vertices
        });
        this.addShape(bumper);
    }

    render = (p) => drawConvex(p, this, colors.bumper1);
}