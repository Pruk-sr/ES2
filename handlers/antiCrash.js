const logger = require('../plugins/logger')
module.exports = async (client) => {
      process.on('unhandledRejection', (reason, p) => {
        logger.error('Unhandled Rejection',
        reason,
        p);
    });
    process.on('rejectionHandled', (p) => { 
        logger.error('Rejection Handled',
        p);
    });
    process.on('uncaughtException', (err, origin) => {
        logger.error('Uncaught Exception',
        err, 
        origin);
    });

      process.on('uncaughtExceptionMonitor', (err, origin) => {
        logger.error('Uncaught Exception Monitor',
        err, 
        origin);
    });
    process.on('warning', (warning) => {
        logger.error('Warning',
        warning);
    });
    logger.info('AntiCrash Events Loaded!');
}
