
/* Generates a random integer between min (inclusive) & max (inclusive) */
const getRandomIntInclusive = (min, max) => {
    max += 1;
    return getRandomInt(min, max);
};

/* Generates a random integer between min (inclusive) & max (exclusive) */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/* Picks a random element from an array */
const getRandomInArray = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)];
}

module.exports = {
    getRandomIntInclusive,
    getRandomInt,
    getRandomInArray
};