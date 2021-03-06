import {Body, Convex, Box} from "p2";
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

        // create curve
        const curve = new Bezier(width/2, paddleHeight, width/4, height, -width/4, height, -width/2, paddleHeight);
        
        // get points from curve
        const lookUpTable = curve.getLUT(16);
        const vertices = [[width/2, 0]];
        for (const {x, y} of lookUpTable) {
            vertices.push([x, y])
        }
        vertices.push([-width/2, 0])
        
        // add bumper
        const bumper = new Convex({
            collisionGroup: groups.bumpers,
            collisionMask: masks.defaultMask,
            vertices: vertices
        });
        this.addShape(bumper);

        // add handlebars
        const leftHandlebar = new Box({
            collisionGroup: groups.defaultGroup,
            collisionMask: masks.handlebars,
            width: paddleHeight,
            height: height
        });
        const rightHandlebar = new Box({
            collisionGroup: groups.defaultGroup,
            collisionMask: masks.handlebars,
            width: paddleHeight,
            height: height
        });
        this.addShape(leftHandlebar, [width/2 + paddleHeight/2 + 1, 0]);
        this.addShape(rightHandlebar, [-width/2 - paddleHeight/2 - 1, 0]);
    }

    render = (p) => drawConvex(p, this, colors.bumper1);
}