import colors from "../utils/colors"
import {canvasHeight} from "../utils/dimensions"

/*
 * Takes a p5 instance and a p2 curved bumper, and draws it to the canvas in the desired color.
 * Currently only used when we want to see the handlebars.
 */
export const drawCurvedBumper = (p, body, color = colors.defaultColor) => {
    const [x, y] = body.interpolatedPosition;
    const angle = body.interpolatedAngle;
    const vertices = body.shapes[0].vertices;
    const handlebars = [body.shapes[1], body.shapes[2]];
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
    p.fill("red");
    for (const handlebar of handlebars) {
        const [x, y] = handlebar.position;
        p.rect(x, y, handlebar.width, handlebar.height); //TODO relative position of handlebars
    }
    p.pop();
};
