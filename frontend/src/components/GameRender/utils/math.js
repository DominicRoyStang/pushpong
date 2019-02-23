/* Returns the distance between two points */
export const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

/* Returns the position of a point rotated <angle> degrees around another (anchor) point */
export const rotateAroundAnchor = (angle, pointX, pointY, anchorX, anchorY) => {

    const rotatedX = Math.cos(angle) * (pointX - anchorX) - Math.sin(angle) * (pointY - anchorY) + anchorX;
    const rotatedY = Math.sin(angle) * (pointX - anchorX) + Math.cos(angle) * (pointY - anchorY) + anchorY;

    return [rotatedX, rotatedY];
};
