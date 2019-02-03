import {Body, Box, LinearSpring, DistanceConstraint} from "p2";
import {canvasHeight, paddleHeight} from "../utils/dimensions"
import {drawRectangle} from "../render";
import colors from "../utils/colors";

/*
 * A player is composed of a rectangular paddle and a bumper connected by springs.
 */
export default class Player {
    constructor(x, y) {
        this.paddle = new Paddle({
            position: [x, y]
        });

        this.springLength = paddleHeight*2;

        this.bumper = new Bumper({
            position: [x + this.springLength, y]
        });

        const spring1 = new PlayerSpring(this.paddle, this.bumper, {
            localAnchorA: [35, 0],
            localAnchorB: [35, 0],
            restLength: this.springLength
        });
        const spring2 = new PlayerSpring(this.paddle, this.bumper, {
            localAnchorA: [-30, 0],
            localAnchorB: [-30, 0],
            restLength: this.springLength
        });
        this.springs = [spring1, spring2];

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
        for (const constraint1 of this.constraints) {
            world.addConstraint(constraint1);
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
            angle: -Math.PI/2,
            angularDamping: 0,
            damping: 0,
            fixedRotation: true,
            fixedX: true,
            mass: 1
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
 * A bumper is the front part of a player that is used to push the ball. It is attached to a paddle via springs.
 */
class Bumper extends Body {
    constructor(props) {
        // set defaults if not specified in props
        props = Object.assign({
            angle: -Math.PI/2,
            angularDamping: 0,
            damping: 0,
            fixedRotation: true,
            mass: 1
        }, props);

        // call parent constructor
        super(props);

        // add bumper
        const bumper = new Box({
            width: canvasHeight/5,
            height: paddleHeight*2
        });
        this.addShape(bumper);
    }

    render = (p) => drawRectangle(p, this, colors.bumper1);
}

/*
 * Springs with rendering
 */
class PlayerSpring extends LinearSpring {
    constructor(paddle, bumper, props) {
        // set defaults if not specified in props
        props = Object.assign({
            stiffness: 3,
            restLength: 10,
            damping : 0.5,
            localAnchorA: [0, 0],
            localAnchorB: [0, 0]
        }, props);

        // call parent constructor
        super(paddle, bumper, props);
    }
}

/*
 * Springs with rendering
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

