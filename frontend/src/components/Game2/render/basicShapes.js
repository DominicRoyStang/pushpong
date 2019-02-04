import colors from "../utils/colors"
import {canvasHeight} from "../utils/dimensions"

/*
 * Takes a p5 instance and a p2 circle body, and draws it to the canvas in the desired color.
 */
const drawCircle = (p, body, color = colors.defaultColor) => {
    const [x, y] = body.interpolatedPosition;
    const angle = body.interpolatedAngle;
    const radius = body.shapes[0].radius;
    p.push();
    p.fill(color);
    // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
    // whereas p2 (physics) uses the bottom left corner as (0,0)
    p.translate(x, canvasHeight - y);
    p.rotate(-angle);
    p.circle(0, 0, radius);
    p.pop();
};

/*
 * Takes a p5 instance and a p2 box body, and draws it to the canvas in the desired color.
 */
const drawRectangle = (p, body, color = colors.defaultColor) => {
    const [x, y] = body.interpolatedPosition;
    const angle = body.interpolatedAngle;
    const width = body.shapes[0].width;
    const height = body.shapes[0].height;
    p.push();
    p.fill(color);
    // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
    // whereas p2 (physics) uses the bottom left corner as (0,0)
    p.translate(x, canvasHeight - y);
    p.rotate(-angle);
    p.rect(0, 0, width, height);
    p.pop();
}

/*
 * Takes a p5 instance and a p2 convex body, and draws it to the canvas in the desired color.
 */
const drawConvex = (p, body, color = colors.defaultColor) => {
    const [x, y] = body.interpolatedPosition;
    const angle = body.interpolatedAngle;
    const vertices = body.shapes[0].vertices;
    p.push();
    p.fill(color);
    // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
    // whereas p2 (physics) uses the bottom left corner as (0,0)
    p.translate(x, canvasHeight - y);
    p.rotate(-angle);
    p.beginShape();
    for (const vertex of vertices) {
        const [vx, vy] = vertex;
        p.vertex(vx, -vy);
    }
    p.endShape(p.CLOSE);
    p.pop();
}

export {
    drawCircle,
    drawConvex,
    drawRectangle
};