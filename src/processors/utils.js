
module.exports = {
    getName, downloadImage, getName, stringToHex, getCategoryObject

};

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const slug = require('slug');
const sha1 = require('sha1');
const mime = require('mime-to-extensions');


function downloadImage(url, name) {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.get(url, {
                method: 'GET',
                responseType: 'stream',
            });
            const fileName = slug(name + '-' + sha1(url + name)) + '.' + mime.extension(response.headers['content-type']);
            const localPath = path.resolve(process.env.IMAGE_URL, 'uploads', fileName);
            const writter = fs.createWriteStream(localPath);
            const stream = response.data.pipe(writter);
            stream.on('finish', () => {
                return resolve('/uploads/' + fileName);
            });
        } catch (error) {
            return resolve(url);
        }
    });
}
