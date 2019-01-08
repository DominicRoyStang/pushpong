import {Bodies, Body, Composite, Constraint} from "matter-js";

const player = (number) => {
    let color = "green";
    let y = 100;
    let x = 0;

    if (number === 0) {
        color = "blue";
        x = 200;
    } else if (number === 1) {
        color = "red";
        x = 500;
    }

    const group = Body.nextGroup(true);

    const player = Composite.create({label: 'Player'});

    const spine = Bodies.rectangle(x, y, 10, 128, {
        label: "spine",
        density: 0.0002
    });

    // Note: bumper is rotated 90 degrees so height is what appears as width in-game
    const bumperHeight = 20
    const bumper = Bodies.trapezoid(x + bumperHeight, y, 128, bumperHeight, 0.1, {
        angle: Math.PI / 2,
        chamfer: {
            radius: [0, 15, 15, 0]
        },
        density: 0.00002,
        friction: 0.8
    });

    const axelA1 = Constraint.create({
        bodyA: bumper,
        bodyB: spine,
        length: 10 + bumperHeight/2,
        pointA: {x: 0, y: 40},
        pointB: {x: 0, y: 35},
        render: {
            strokeStyle: "black",
            type: "line"
        },
        stiffness: 0.8
    });

    const axelA2 = Constraint.create({
        bodyA: bumper,
        bodyB: spine,
        length: 10 + bumperHeight/2,
        pointA: {x: 0, y: 30},
        pointB: {x: 0, y: 35},
        render: {
            strokeStyle: "black",
            type: "line"
        },
        stiffness: 0.8
    });

    const axelB1 = Constraint.create({
        bodyA: bumper,
        bodyB: spine,
        length: 10 + bumperHeight/2,
        pointA: {x: 0, y: -40},
        pointB: {x: 0, y: -35},
        render: {
            strokeStyle: "black",
            type: "line"
        },
        stiffness: 0.8
    });

    const axelB2 = Constraint.create({
        bodyA: bumper,
        bodyB: spine,
        length: 10 + bumperHeight/2,
        pointA: {x: 0, y: -30},
        pointB: {x: 0, y: -35},
        render: {
            strokeStyle: "black",
            type: "line"
        },
        stiffness: 0.8
    });

    Composite.addBody(player, spine);
    Composite.addBody(player, bumper);
    Composite.addConstraint(player, axelA1);
    Composite.addConstraint(player, axelA2);
    Composite.addConstraint(player, axelB1);
    Composite.addConstraint(player, axelB2);

    return player;
}

export default player;
