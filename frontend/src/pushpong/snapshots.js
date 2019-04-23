export const createSnapshot = (player, ball) => {
    return {
        player: {
            position: player.paddle.position,
            velocity: player.paddle.velocity
        },
        ball: {
            position: ball.position,
            velocity: ball.velocity
        }
    };
};