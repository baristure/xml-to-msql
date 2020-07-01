const logger = require('./logger');

const xmlConvert = require('./processors/xmlconvert.js');

module.exports = async (mysql) => {
    logger.info('New cycle has started');
    await xmlConvert(mysql);
};
