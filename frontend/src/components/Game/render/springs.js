import colors from "../utils/colors"
import {canvasHeight} from "../utils/dimensions"

/*
 * Takes a p5 instance and a p2 spring, and draws it to the canvas in the desired color.
 */
const drawLineSpring = (p, spring, color = colors.defaultColor) => {
    const bodyA = spring.bodyA;
    let anchorA = [0, 0];
    bodyA.toWorldFrame(anchorA, spring.localAnchorA);
    let [xAnchorA, yAnchorA] = anchorA;
    yAnchorA = canvasHeight - yAnchorA;

    const bodyB = spring.bodyB;
    let anchorB = [0, 0];
    bodyB.toWorldFrame(anchorB, spring.localAnchorB);
    let [xAnchorB, yAnchorB] = anchorB;
    yAnchorB = canvasHeight - yAnchorB

    
    p.push();
    p.stroke(color);
    p.strokeWeight(2);

    // draw circles at anchor points
    p.circle(xAnchorA, yAnchorA, 2);
    p.circle(xAnchorB, yAnchorB, 2);
    // connect circles with a line
    p.line(xAnchorA, yAnchorA, xAnchorB, yAnchorB);
    
    p.pop();
};

export {
    drawLineSpring
};