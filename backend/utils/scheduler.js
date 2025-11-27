const cron = require('node-cron');
const RefreshToken = require('../models/RefreshToken');
const logger = require('./logger');

class TokenScheduler {
    // Run cleanup every day at 3:00 AM
    static startDailyCleanup() {
        // Cron format: minute hour day month weekday
        // '0 3 * * *' = 3:00 AM every day
        cron.schedule('0 3 * * *', async () => {
            try {
                logger.info('Starting scheduled token cleanup...');

                const deletedCount = await RefreshToken.cleanupExpiredTokens();

                logger.info(`Scheduled cleanup completed: ${deletedCount} tokens deleted`);
            } catch (error) {
                logger.error('Scheduled token cleanup failed:', error);
            }
        });

        logger.info('Token cleanup scheduler started (runs daily at 3:00 AM)');
    }

    // Alternative: Run cleanup every hour
    static startHourlyCleanup() {
        // '0 * * * *' = Every hour at minute 0
        cron.schedule('0 * * * *', async () => {
            try {
                logger.info('Starting hourly token cleanup...');

                const deletedCount = await RefreshToken.cleanupExpiredTokens();

                logger.info(`Hourly cleanup completed: ${deletedCount} tokens deleted`);
            } catch (error) {
                logger.error('Hourly token cleanup failed:', error);
            }
        });

        logger.info('Token cleanup scheduler started (runs every hour)');
    }

    // Run cleanup every 6 hours (good balance)
    static startPeriodicCleanup() {
        // '0 */6 * * *' = Every 6 hours
        cron.schedule('0 */6 * * *', async () => {
            try {
                const now = new Date().toLocaleString();
                logger.info(`Starting periodic token cleanup at ${now}`);

                const deletedCount = await RefreshToken.cleanupExpiredTokens();

                logger.info(`Periodic cleanup completed: ${deletedCount} tokens deleted`);
            } catch (error) {
                logger.error('Periodic token cleanup failed:', error);
            }
        });

        logger.info('Token cleanup scheduler started (runs every 6 hours)');
    }
}

module.exports = TokenScheduler;
