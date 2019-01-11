import {Bodies, Composite, Constraint} from "matter-js";
import {paddleBoundSpacing, canvasHeight} from "../utils/dimensions";
import filters from "../utils/filters";

/*
 * By default, a player is horizontal, with the bumper facing upwards
 */
const player = (x, y) => {

    // size constants
    const player = Composite.create({label: 'player'});
    const width = canvasHeight/5;
    const paddleHeight = paddleBoundSpacing;
    const bumperHeight = paddleHeight*2;
    const springLength = paddleHeight + bumperHeight/2;

    const paddle = Bodies.rectangle(x, y, width, paddleHeight, {
        collisionFilter: {
            category: filters.paddles,
            mask: filters.defaultFilter | filters.invisible
        },
        density: 0.1,
        label: "paddle"
    });

    // Note: bumper is rotated 90 degrees so height is what appears as width in-game
    const bumper = Bodies.trapezoid(x, y-springLength, width, bumperHeight, 0.1, {
        chamfer: {
            radius: [0, 15, 15, 0]
        },
        label: "bumper"
    });

    const springA1 = createSpring(paddle, bumper, 35, 30, springLength);
    const springA2 = createSpring(paddle, bumper, 35, 40, springLength);
    const springB1 = createSpring(paddle, bumper, -35, -40, springLength); 
    const springB2 = createSpring(paddle, bumper, -35, -30, springLength);

    Composite.addBody(player, paddle);
    Composite.addBody(player, bumper);
    Composite.addConstraint(player, springA1);
    Composite.addConstraint(player, springA2);
    Composite.addConstraint(player, springB1);
    Composite.addConstraint(player, springB2);

    return player;
}

const createSpring = (bodyA, bodyB, xA, xB, length) => Constraint.create({
    bodyA: bodyA,
    bodyB: bodyB,
    length: length,
    pointA: {x: xA, y: 0},
    pointB: {x: xB, y: 0},
    render: {
        strokeStyle: "black",
        type: "line"
    },
    stiffness: 0.05
});

export default player;
