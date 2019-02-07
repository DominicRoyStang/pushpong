import {Body, Box, LinearSpring, DistanceConstraint} from "p2";
import {canvasHeight, paddleHeight} from "../utils/dimensions"
import {drawRectangle, drawLineSpring} from "../render";
import {RectangularBumper} from "./bumpers";
import colors from "../utils/colors";
import {rotateAroundAnchor} from "../utils/math";

/*
 * A player is composed of a rectangular paddle and a bumper connected by springs.
 * The default orientation of a player is bumper facing upwards.
 */
export default class Player {
    constructor(x, y, angle) {
        this.angle = angle
        // Dimensions
        this.springLength = paddleHeight;
        
        // Bodies
        this.paddle = new Paddle({
            position: [x, y],
            angle: angle
        });

        this.bumper = new RectangularBumper({
            position: rotateAroundAnchor(x, y, ...this.paddle.position, angle),
            angle: angle,
            mass: 100
        });

        // Springs
        const spring1 = new PlayerSpring(this.paddle, this.bumper, {
            localAnchorA: [35, this.paddle.shapes[0].centerOfMass[1]],
            localAnchorB: [35, this.bumper.shapes[0].centerOfMass[1]],
            restLength: this.springLength
        });
        const spring2 = new PlayerSpring(this.paddle, this.bumper, {
            localAnchorA: [-35, this.paddle.shapes[0].centerOfMass[1]],
            localAnchorB: [-35, this.bumper.shapes[0].centerOfMass[1]],
            restLength: this.springLength
        });
        this.springs = [spring1, spring2];

        // Permanent Constraints
        const distanceConstraint = new PaddleBumperDistanceConstraint(this.paddle, this.bumper, {
            upperLimitEnabled: true,
            lowerLimitEnabled: true,
            upperLimit: this.springLength*2,
            lowerLimit: this.springLength
        });
        this.constraints = [distanceConstraint];
    }

    addToWorld(world) {
        // add bodies
        world.addBody(this.paddle);
        world.addBody(this.bumper);
        
        // add springs
        for (const spring of this.springs) {
            world.addSpring(spring);
        }
        for (const constraint of this.constraints) {
            world.addConstraint(constraint);
        }
        
    }
}

/*
 * A paddle is the "spine" of the player. The bumper is attached to it via springs.
 */
class Paddle extends Body {
    constructor(props) {
        // set defaults if not specified in props
        props = Object.assign({
            angularDamping: 0,
            damping: 0,
            fixedRotation: true,
            mass: 1000
        }, props);

        // call parent constructor
        super(props);

        // add paddle
        const paddle = new Box({
            width: canvasHeight/5,
            height: paddleHeight
        });
        this.addShape(paddle);
    }

    render = (p) => drawRectangle(p, this, colors.paddle1);
}

/*
 * Springs with rendering
 */
class PlayerSpring extends LinearSpring {
    constructor(paddle, bumper, props) {
        // set defaults if not specified in props
        props = Object.assign({
            stiffness: 3*bumper.mass,
            restLength: 10,
            damping : 0.5,
            localAnchorA: [-35, paddle.shapes[0].centerOfMass[1]],
            localAnchorB: [-35, bumper.shapes[0].centerOfMass[1]]
        }, props);

        // call parent constructor
        super(paddle, bumper, props);
    }

    render = (p) => drawLineSpring(p, this, colors.defaultColor);
}

/*
 * Limits to how far the springs may stretch
 */
class PaddleBumperDistanceConstraint extends DistanceConstraint {
    constructor(paddle, bumper, props) {
        // set defaults if not specified in props
        props = Object.assign({
            upperLimitEnabled: true,
            lowerLimitEnabled: true,
            upperLimit: 100,
            lowerlimit: 0,
            localAnchorA: [0, 0],
            localAnchorB: [0, 0]
        }, props);

        // call parent constructor
        super(paddle, bumper, props);

        // Fix upper and lowerlimit props not being applied
        // Opened pull request: https://github.com/schteppe/p2.js/pull/341
        this.upperLimitEnabled = props.upperLimitEnabled;
        this.lowerLimitEnabled = props.lowerLimitEnabled;
        this.lowerLimit = props.lowerLimit;
        this.upperLimit = props.upperLimit;
    }
}

