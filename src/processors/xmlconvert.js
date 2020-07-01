const logger = require('../logger');
const xml = require('../xml');
// You can use fs module read function for your local xml files.
const fs = require('fs')
const utils = require('./utils');
function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            default:
                return char;
        }
    });
 }
module.exports = (mysql) => {
    return new Promise(async (resolve, reject) => {
        try {
            logger.info('New xml data import started...');
            const xmlUrl = "Paste your XML feed URL";
            //Change data to your XMLs object tree
            const products = (await xml.getXML(xmlUrl, 'utf-8')).data;
            /*--------------Use this format for Categories,Authors,etc----------------*/
            const categoriesRef = [];
            const categories = [];
            for (let product of products) {
                // I choose ref to product.name
                if (!categoriesRef.includes(product.name)) {
                    categoriesRef.push(product.name);
                    // Change the following object values to your variable names
                    categories.push({
                        'name': mysql_real_escape_string(product.name),
                        'category': mysql_real_escape_string(product.category),
                        'url': mysql_real_escape_string(product.name).toLowerCase().trim()
                    })
                }
            }
            for (let category of categories) {
                //set your table-column names and value fields
                let mysqlData = {
                    name: category.name,
                    url: category.url,
                    created: Date.now()
                }
                const query = await mysql.query('SELECT * FROM `table_name` where `url` =?', [mysqlData.url] );
                if (!query || !query.length) {
                    await mysql.insert('table_name', mysqlData);
                } else {
                    if (query[0].url === mysqlData.url) delete mysqlData.url;
                    await mysql.update('table_name', {

                        id: query[0].id
                    }, mysqlData);
                }
            }
            /*--------------Use this format to books,products,etc----------------*/

            for (let product of products) {
                const category_id = await mysql.query('SELECT * FROM `category_table_name` where `name` =?', [mysql_real_escape_string(product.category)]);

                let image = await utils.downloadImage(product.img, mysql_real_escape_string(product.name));
                //set your table-column names and value fields
                let productData = {
                    category_id: category_id[0].id,
                    name: mysql_real_escape_string(product.name),
                    publisher: product.publisher || null,
                    image: image,
                    price: product.price_field || null,
                    edition_number: product.version || null,
                    status: 1,
                    barcode: product.id,
                    url: slug(category_id[0].id + '-' + mysql_real_escape_string(product.name), {
                        lower: true
                    })
                }
                const query = await mysql.query('SELECT * FROM `product_table` where `url` =?', [productData.url]);

                if (!query || !query.length) {
                    await mysql.insert('product_table', productData);
                } else {
                    if (query[0].url === productData.url) delete productData.url;
                    await mysql.update('product_table', {

                        id: query[0].id
                    }, productData);
                }
            }

            logger.info('New xml data import finished...');
            return resolve(1);
        } catch (error) {
            return reject(error);
        }
    });

};
