export const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const rotateAroundAnchor = (pointX, pointY, anchorX, anchorY, angle) => {
    const radius = distance(pointX, pointY, anchorX, anchorY);
    return [anchorX + Math.sin(-angle)*radius, anchorY + Math.cos(-angle)*radius];
};
