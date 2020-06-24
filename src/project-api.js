module.exports = init;

const mysql = require('./mysql-connector');
const start = require('./import.js');
const logger = require('./logger');

async function init() {
    try {
        mysql.connect();
        start(mysql);
        setInterval(() => {
            start(mysql);
        }, Number.parseInt(process.env.INTERVAL_VALUE));
    } catch (error) {
        logger.error(error);
        mysql.disconnect();
    }
}