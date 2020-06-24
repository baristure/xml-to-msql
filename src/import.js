const logger = require('./logger');

// const drBookCategoriesImport = require('./processors/drBookCategories');
const xmlConvert = require('./processors/xmlconvert.js');

module.exports = async (mysql) => {
    logger.info('New cycle has started');
    // await drBookCategoriesImport(mysql);
    await xmlConvert(mysql);
};