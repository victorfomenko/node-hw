const fs = require('fs');
const normalizePath = require('./normalizePath');
const mime = require('mime');

module.exports = (filePath, res) => {
    let path = '';
    try {
        path = normalizePath(filePath);
    } catch (e) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
    }

    sendFile(path, res);
};

const sendFile = (filePath, res) => {
    const file = new fs.ReadStream(filePath);

    file.pipe(res);
    file.on('error', (err) => {
        if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
        } else {
            if (!res.headersSent) {
                res.statusCode = 500;
                res.end('Internal error');
            } else {
                res.end();
            }
        }
    });

    res.on('open', () => {
        res.setHeader(
            'Content-Type', `${mime.lookup(filePath)}; charset=utf-8`
        );
    });

    res.on('close', () => {
        file.destroy();
    });
};


