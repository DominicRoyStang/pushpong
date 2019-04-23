import {canvasWidth, canvasHeight, boundWidth, paddleOffset, paddleHeight} from "./utils/dimensions";
import {Boundary, Ball, GoalSensor, Player} from "./bodies";
import {rotateAroundAnchor} from "./utils/math";
import {groups, masks} from "./utils/collisions";

const playerPositions = [
    {x: paddleOffset, y: canvasHeight/2, angle: -Math.PI/2},
    {x: canvasWidth - paddleOffset, y: canvasHeight/2, angle: Math.PI/2},
    {x: canvasWidth/2, y: paddleOffset, angle: 0},
    {x: canvasWidth/2, y: canvasHeight - paddleOffset, angle: Math.PI}
];

export const worldSetup = (world, onPlayer1Goal, onPlayer2Goal) => {
    world.defaultContactMaterial.restitution = 1;
    world.defaultContactMaterial.contactSkinSize = 0;

    // Create walls
    const ground = new Boundary({
        position: [canvasWidth/2, 0 - boundWidth/2]
    }, canvasWidth, boundWidth);
    const ceiling = new Boundary({
        position: [canvasWidth/2, canvasHeight + boundWidth/2]
    }, canvasWidth, boundWidth);

    // Setup sensors
    setupSensors(world, onPlayer2Goal, onPlayer1Goal);

    // Add bodies to world
    world.addBody(ground);
    world.addBody(ceiling);

    // Run the physics engine
    runEngine(world);
};

export const addBall = (world, x = canvasWidth/2, y = canvasHeight*10) => {
    // Create ball
    const ball = new Ball({
        position: [x, y]
    });
    world.addBody(ball);
    return ball;
};

export const resetBall = (ball) => {
    ball.position = [paddleOffset*5.6, canvasHeight/2];
    ball.velocity = [0, 0];
};

export const hideBall = (ball) => {
    ball.position = [canvasWidth/2, canvasHeight*10];
    ball.velocity = [0, 0];
};

export const addPlayer = (world, playerNumber) => {
    const {x, y, angle} = playerPositions[playerNumber - 1];
    const player = new Player(x, y, angle);

    const [bound1, bound2] = createPlayerBounds(player);

    world.addBody(bound1);
    world.addBody(bound2);

    player.addToWorld(world);
    return player;
};

export const resetPlayer = (player, playerNumber) => {
    const {x, y} = playerPositions[playerNumber - 1];
    player.setPosition([x, y]);
    player.setVelocity([0, 0]);
}

const createPlayerBounds = (player) => {
    const [paddleX, paddleY] = player.paddle.position;
    const angle = player.paddle.angle;

    const bound1 = new Boundary({
        angle: angle,
        position: rotateAroundAnchor(angle, paddleX, paddleY - boundWidth/2 - paddleHeight/2, ...player.paddle.position)
    }, Math.max(canvasWidth, canvasHeight), boundWidth, groups.invisible, masks.invisible);

    const bound2 = new Boundary({
        angle: angle,
        position: rotateAroundAnchor(angle, paddleX, paddleY + boundWidth/2 + paddleHeight/2 +0.5, ...player.paddle.position)
    }, Math.max(canvasWidth, canvasHeight), boundWidth, groups.invisible, masks.invisible);

    // make bounds invisible
    bound1.render = () => {};
    bound2.render = () => {};

    return [bound1, bound2]
}

const setupSensors = (world, onLeftActive, onRightActive) => {
    // Create sensors
    const leftSensor = new GoalSensor({
        position: [-10, canvasHeight/2]
    });

    const rightSensor = new GoalSensor({
        angle: -Math.PI/2,
        position: [canvasWidth + 10, canvasHeight/2]
    });

    world.addBody(leftSensor);
    world.addBody(rightSensor);

    world.on("endContact", (event) => {
        if (event.bodyA === leftSensor || event.bodyB === leftSensor) {
            onLeftActive();
        }
        if (event.bodyA === rightSensor || event.bodyB === rightSensor) {
            onRightActive();
        }
    });
}

// Runs the engine at a framerate-independent speed.
const runEngine = (world) => {
    let maxSubSteps = 10;
    let fixedTimeStep = 1/60;
    let lastTimeSeconds;
    const animate = (t) => {
        requestAnimationFrame(animate);
        const timeSeconds = t/1000;
        lastTimeSeconds = lastTimeSeconds || timeSeconds;
        const timeSinceLastCall = timeSeconds - lastTimeSeconds;
        world.step(fixedTimeStep, timeSinceLastCall, maxSubSteps);
    }
    requestAnimationFrame(animate);
}