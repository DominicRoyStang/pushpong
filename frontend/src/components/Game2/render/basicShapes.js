import colors from "../utils/colors"
import {canvasHeight} from "../utils/dimensions"

/*
 * Takes a p5 instance and a p2 circle body, and draws it to the canvas in the desired color.
 */
const drawCircle = (p, body, color = colors.ball) => {
    const [x, y] = body.interpolatedPosition;
    const radius = body.shapes[0].radius;
    p.noStroke();
    p.fill(color);
    // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
    // whereas p2 (physics) uses the bottom left corner as (0,0)
    p.circle(x, canvasHeight - y, radius);
};

/*
 * Takes a p5 instance and a p2 box body, and draws it to the canvas in the desired color.
 */
const drawRectangle = (p, body, color = colors.border) => {
    const [x, y] = body.interpolatedPosition;
    const width = body.shapes[0].width;
    const height = body.shapes[0].height;
    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill(color);
    // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
    // whereas p2 (physics) uses the bottom left corner as (0,0)
    p.rect(x, canvasHeight - y, width, height);
}

export {
    drawCircle,
    drawRectangle
};