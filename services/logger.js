const winston = require("winston");
const { combine, timestamp, json } = winston.format;
const logger = winston.createLogger({
  level: "info",
  format: combine(
    json(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
  ),
  defaultMeta: { service: "users-service", timestamp: new Date()},
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
