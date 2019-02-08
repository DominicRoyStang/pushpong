import {canvasWidth, canvasHeight, boundWidth, paddleOffset, paddleHeight} from "./utils/dimensions";
import {Boundary, Ball, Player} from "./bodies";
import {rotateAroundAnchor} from "./utils/math";
import {groups, masks} from "./utils/collisions";

export const worldSetup = (world) => {

    // Create walls
    const ground = new Boundary({
        position: [canvasWidth/2, 0 - boundWidth/2]
    }, canvasWidth, boundWidth);
    const ceiling = new Boundary({
        position: [canvasWidth/2, canvasHeight + boundWidth/2]
    }, canvasWidth, boundWidth);

    // Add bodies to world
    world.addBody(ground);
    world.addBody(ceiling);
};

export const addBall = (world, x = paddleOffset*6, y = canvasHeight/2) => {

    // Create ball
    const ball = new Ball({
        position: [x, y]
    });
    world.addBody(ball);
}

export const addPlayer = (world, playerNumber) => {

    const playerPositions = [
        {x: paddleOffset, y: canvasHeight/2, angle: -Math.PI/2},
        {x: canvasWidth - paddleOffset, y: canvasHeight/2, angle: Math.PI/2},
        {x: canvasWidth/2, y: paddleOffset, angle: 0},
        {x: canvasWidth/2, y: canvasHeight - paddleOffset, angle: Math.PI}
    ];
    const {x, y, angle} = playerPositions[playerNumber];
    const player = new Player(x, y, angle);

    const [bound1, bound2] = createPlayerBounds(player);

    world.addBody(bound1);
    world.addBody(bound2);

    player.addToWorld(world);
    return player;
};

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