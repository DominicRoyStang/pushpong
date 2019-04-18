export const groups = {
    defaultGroup: Math.pow(2, 0),
    invisible: Math.pow(2, 1),
    paddles: Math.pow(2, 2),
    bumpers: Math.pow(2, 3),
    balls: Math.pow(2, 4)
};

export const masks = {
    defaultMask: groups.defaultGroup | groups.paddles | groups.bumpers | groups.balls, // anything except "invisible"
    invisible: groups.paddles, // paddle boundaries
    paddles: -1,  // -1 means it collides with every possible group
    handlebars: groups.paddles | groups.bumpers,
    goals: groups.balls
};
