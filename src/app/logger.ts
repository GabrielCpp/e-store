import { createLogger, format, transports, Logger } from 'winston'

export const logger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    )
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

if (process.env.NODE_ENV === 'production') {
    logger.add(new transports.File({ filename: 'error.log', level: 'error' }))
    logger.add(new transports.File({ filename: 'combined.log' }))
}