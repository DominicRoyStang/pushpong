const {createLogger, format, transports} = require("winston");

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        // Write to all logs with level `info` and below to `combined.log` 
        // Write all logs error (and below) to `error.log`.
        new transports.File({
            filename: "logs/error.log.json",
            level: "error"
        }),
        new transports.File({
            filename: "logs/combined.log.json"
        }),
    ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: format.simple()
    }));
    logger.add(new transports.File({
        filename: "logs/all.log.json",
        level: "silly"
    }));
}

module.exports = logger;