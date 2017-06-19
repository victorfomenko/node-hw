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
            return;
        }
    });
    deleteFile(path, res);
};

const deleteFile = (filePath, res) => {
    try {
        fs.unlinkSync(filePath);
        res.end('OK');
    } catch (e) {
        res.statusCode = 500;
        res.end('Server error');
    };
    return;
};
