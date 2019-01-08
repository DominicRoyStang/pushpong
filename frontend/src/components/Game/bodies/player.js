import {Bodies, Composite, Constraint} from "matter-js";

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

    console.log(color);

    const player = Composite.create({label: 'player'});

    const spine = Bodies.rectangle(x, y, 10, 128, {
        density: 0.0002,
        label: "spine"
    });

    // Note: bumper is rotated 90 degrees so height is what appears as width in-game
    const bumperHeight = 20
    const bumper = Bodies.trapezoid(x + bumperHeight, y, 128, bumperHeight, 0.1, {
        angle: Math.PI / 2,
        chamfer: {
            radius: [0, 15, 15, 0]
        },
        density: 0.00002,
        friction: 0.8,
        label: "bumper"
    });

    const springA1 = createSpring(spine, bumper, 35, 40);
    const springA2 = createSpring(spine, bumper, 35, 30);
    const springB1 = createSpring(spine, bumper, -35, -40); 
    const springB2 = createSpring(spine, bumper, -35, -30);

    Composite.addBody(player, spine);
    Composite.addBody(player, bumper);
    Composite.addConstraint(player, springA1);
    Composite.addConstraint(player, springA2);
    Composite.addConstraint(player, springB1);
    Composite.addConstraint(player, springB2);

    return player;
}

const createSpring = (bodyA, bodyB, yA, yB) => Constraint.create({
    bodyA: bodyA,
    bodyB: bodyB,
    length: 10 + 20/2,
    pointA: {x: 0, y: yA},
    pointB: {x: 0, y: yB},
    render: {
        strokeStyle: "black",
        type: "line"
    },
    stiffness: 0.8
});

export default player;
