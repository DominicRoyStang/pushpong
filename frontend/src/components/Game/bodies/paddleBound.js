import {Bodies, Body} from "matter-js";
import {boundWidth, canvasHeight, paddleBoundSpacing} from "../utils/dimensions";
import filters from "../utils/filters";
import colors from "../utils/colors";

/*
 * A paddle bound is an invisible barrier that only interacts with the
 * paddle of a player to prevent it from moving horizontally.
 */
const PaddleBound = (x, y = canvasHeight/2) => {
    return Bodies.rectangle(x, y, boundWidth, canvasHeight, {
        isStatic: true,
        collisionFilter: {
            category: filters.invisible,
            mask: filters.paddles
        },
        friction: 0,
        render: {
            fillStyle: colors.background,
            lineWidth: 0
        }
    });
}

/*
 * A paddle bound pair is a body composed of two paddle bound parts.
 * Takes the same x and y values as the paddle (player) it surrounds.
 */
const paddleBoundPair = (x, y = canvasHeight/2) => {
    const pair = Body.create({
        collisionFilter: {
            category: filters.invisible,
            mask: filters.paddles
        },
        isStatic: true,
        x: x,
        y: y
    });
    // the left bound is 1 pixel closer than a perfect fit to minimize paddle wobbling.
    const leftBound = new PaddleBound(x - paddleBoundSpacing/2 - boundWidth/2 + 1);
    const rightBound = new PaddleBound(x + paddleBoundSpacing/2 + boundWidth/2);
    Body.setParts(pair, [leftBound, rightBound]);
    return pair;
}


export default paddleBoundPair;
