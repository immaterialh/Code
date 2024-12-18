const fs = require('node:fs/promises');
const db = require('./db.js');

const sendfile = (o, fileName, options) =>
    fs.readFile(fileName, options)
    .then(file => o.end(file));

const sendutf8 = (o, file) => sendfile(o, file, 'utf8');

const getKV = (o, _, i) =>
    db.getKV(i.headers.key)
    .then(value => o.end(value));

module.exports = {
    '': o => sendfile(o, 'index.html', 'utf8'),
    'base.css': sendutf8,
    'favicon.ico': sendfile,
    getKV,
};