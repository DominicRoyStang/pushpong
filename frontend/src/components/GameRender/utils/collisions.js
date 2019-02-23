export const groups = {
    defaultGroup: Math.pow(2, 0),
    invisible: Math.pow(2, 1),
    paddles: Math.pow(2, 2)
};

export const masks = {
    defaultMask: groups.defaultGroup | groups.paddles,
    invisible: groups.paddles,
    paddles: -1 // -1 means it collides with every possible group
};
