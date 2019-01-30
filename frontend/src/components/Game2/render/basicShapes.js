import colors from "../utils/colors"
import {canvasHeight} from "../utils/dimensions"

const drawCircle = (p, body, color = colors.ball) => {
    const [x, y] = body.interpolatedPosition;
    const radius = body.shapes[0].radius;
    p.noStroke();
    p.fill(color);
    // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
    // whereas p2 (physics) uses the top right corner as (0,0)
    p.circle(x, canvasHeight - y, radius);
};

const drawRectangle = (p, body, color = colors.border) => {
    const [x, y] = body.interpolatedPosition;
    const width = 300;
    const height = 30;
    p.noStroke();
    p.fill(color);
    p.rect(x, canvasHeight - y, width, height);
}

export {
    drawCircle,
    drawRectangle
};