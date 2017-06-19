const fs = require('fs');
const normalizePath = require('./normalizePath');

module.exports = (filePath, res) => {
    let path = '';
    try {
        path = normalizePath(filePath);
    } catch (e) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
    }

    fs.stat(path, (err, stats) => {
        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end('File not found');
            return null;
        }
    });
    sendFile(path, res);
};

const sendFile = (filePath, res) => {
    const mime = require('mime').lookup(filePath);
    const file = new fs.ReadStream(filePath);

    res.setHeader('Content-Type', `${mime}; charset=utf-8`);
    file.pipe(res);
    file.on('error', () => {
        res.statusCode = 500;
        res.end('Server error');
        return;
    });

    res.on('close', () => {
        file.destroy();
    });
};


