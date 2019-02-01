import colors from "../utils/colors"
import {canvasHeight} from "../utils/dimensions"

/*
 * Takes a p5 instance and a p2 circle body, and draws it to the canvas in the desired color.
 */
const drawCircle = (p, body, color = colors.ball) => {
    const [x, y] = body.interpolatedPosition;
    const angle = body.angle;
    const radius = body.shapes[0].radius;
    p.push();
    p.fill(color);
    p.translate(x, canvasHeight - y);
    p.rotate(angle);
    // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
    // whereas p2 (physics) uses the bottom left corner as (0,0)
    p.circle(0, 0, radius);
    p.pop();
};

/*
 * Takes a p5 instance and a p2 box body, and draws it to the canvas in the desired color.
 */
const drawRectangle = (p, body, color = colors.border) => {
    const [x, y] = body.interpolatedPosition;
    const angle = body.angle;
    const width = body.shapes[0].width;
    const height = body.shapes[0].height;
    p.push();
    p.fill(color);
    p.translate(x, canvasHeight - y);
    p.rotate(angle);
    // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
    // whereas p2 (physics) uses the bottom left corner as (0,0)
    p.rect(0, 0, width, height);
    p.pop();
}

export {
    drawCircle,
    drawRectangle
};