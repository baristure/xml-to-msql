module.exports = {
    getXML
};

const axios = require('axios');
const iconv = require('iconv-lite');
const parser = require('fast-xml-parser')
const xmlJS = require('xml-js');

const options = {
    attributeNamePrefix: '',
    attrNodeName: '_attributes', //default is 'false'
    textNodeName: '_text',
    ignoreAttributes: false,
    ignoreNameSpace: false,
    allowBooleanAttributes: true,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: '_cdata', //default is 'false'
    cdataPositionChar: '\\c',
    parseTrueNumberOnly: true,
    arrayMode: false, //"strict"
    stopNodes: ['parse-me-as-string']
}
function getXML(url, encoding) {
    // return new Promise((resolve, reject) => {
    //     axios
    //         .get(url, {
    //             responseType: 'arraybuffer',
    //             responseEncoding: 'binary'
    //         })
    //         .then((res) => {
    //             return resolve(xmlJS.xml2js(iconv.decode(res.data, encoding), {
    //                 compact: true
    //             }));
    //         })
    //         .catch((err) => {
    //             return reject(err);
    //         });
    // });
    // return new Promise((resolve, reject) => {
    //     axios
    //         .get(url, {
    //             responseType: 'arraybuffer',
    //             responseEncoding: 'binary'
    //         },
    //          )
    //         .then((res) => {
    //             return resolve(parser.parse(url, options));
    //         })
    //         .catch((err) => {
    //             return reject(err);
    //         });

    // });
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            })
            .then((res) => {
                return resolve(parser.parse(res.data.toString(), options));
            })
            .catch((err) => {
                return reject(err);
            });
    });

    // setTimeout(()=>{
    //     return resolve((parser.parse(url, options)))
    // },15000)

}