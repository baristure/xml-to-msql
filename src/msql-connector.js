module.exports = {
    query,
    insert,
    update,
    connect,
    disconnect,
};

const logger = require('./logger');

const mysql = require('mysql');
let connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    port: '3306',

});

function connect() {
    connection.connect((err) => {
        if (err) {
            disconnect(err);
        }
    });
}

function disconnect(err = null) {
    connection.end();
    if (err)
        logger.error(err);
    setTimeout(() => {
        process.exit(1);
    }, 1000);
}

async function query(string) {
    return new Promise((resolve, reject) => {
        try {
            connection.query(string, (error, res) => {
                if (error) throw new Error(error);
                return resolve(res);
            });
        } catch (error) {
            return reject(error);
        }

    });
}

async function insert(tableName, data) {
    return new Promise((resolve, reject) => {
        try {
            if (!tableName) throw new Error('Table name is required');
            if (!data) throw new Error('Data is required');
            let counter = 0;
            let query = 'INSERT INTO ' + tableName + ' ';
            let cols = '(';
            let values = '(';
            for (let col in data) {
                if (counter) {
                    cols += ',';
                    values += ',';
                }
                cols += col;
                if (data[col] || data[col] === 0) values += '\'' + data[col].toString().replace(/'/g, '\\\'') + '\'';
                else values += 'NULL';
                counter++;
            }
            cols += ')';
            values += ')';
            query += (cols + ' VALUES ' + values);
            connection.query(query, (error, res) => {
                if (error) throw new Error(error);
                resolve(res);
            });
        } catch (error) {
            return reject(error);
        }
    });
}

async function update(tableName, q, data) {
    return new Promise((resolve, reject) => {
        try {
            if (!tableName) throw new Error('Table name is required');
            if (!data) throw new Error('Data is required');
            let counter = 0;
            let query = 'UPDATE ' + tableName + ' SET ';
            for (let col in data) {
                if (counter) query += ',';
                if (data[col] || data[col] === 0) query += (col + '= \'' + data[col].toString().replace(/'/g, '\\\'') + '\'');
                else query += (col + '=NULL');
                counter++;
            }
            query += (' WHERE ');
            let c = 0;
            for (let col in q) {
                if (c) query += ' AND ';
                if (q[col] || q[col] === 0) query += (col + '=\'' + q[col].toString().replace(/'/g, '\\\'') + '\'');
                else query += (col + '=NULL');
                c++;
            }
            connection.query(query, (error, res) => {
                if (error) throw new Error(error);

                resolve(res);
            });
        } catch (error) {
            return reject(error);
        }
    });
}