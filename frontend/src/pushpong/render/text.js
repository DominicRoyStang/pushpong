import {canvasHeight, canvasWidth} from "../utils/dimensions"

/*
 * Takes a p5 instance and writes to the scoreboard
 */
const writeScore = (p, text) => {
    p.push();
    p.text(text, canvasWidth/2, p.textAscent());
    p.pop();
};

/*
 * Takes a p5 instance and writes a title (main text)
 */
const writeTitle = (p, text) => {
    p.push();
    p.text(text, canvasWidth/2, canvasHeight/2);
    p.pop();
};

/*
 * Takes a p5 instance and writes a subtitle (secondary text)
 */
const writeSubtitle = (p, text) => {
    p.push();
    p.textSize(20);
    p.fill("gray");
    p.text(text, canvasWidth/2, canvasHeight/2 + 20 + p.textAscent());
    p.pop();
};

export {
    writeScore,
    writeTitle,
    writeSubtitle
};