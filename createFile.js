const fs = require('fs');
const normalizePath = require('./normalizePath');

module.exports = (filePath, req, res) => {
    let fileName = filePath.slice(1); //  /text.ext -> text.ext

    if (!fileName) {
        res.statusCode = 404;
        res.end('File not found');
    }

    try {
        path = normalizePath(filePath);
    } catch (e) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
    }

    writeFile(path, res, req);
};


const writeFile = (filePath, res, req) => {
    // non-streaming client sends this
    if (req.headers['content-length'] > 1024 * 1024) {
        res.statusCode = 413;
        res.end('File is too big!');
        return;
    }

    let size = 0;
    let writeStream = new fs.WriteStream(filePath, {flags: 'wx'});


    req
        .on('data', (chunk)=>{
            size += chunk.length;
            if (size > 1024 * 1024) {
                res.statusCode = 413;
                res.setHeader('Connection', 'close');
                res.end('File too big');
                writeStream.destroy();
                fs.unlink(filePath, (error) => { // eslint-disable-line
                    /* ignore error */
                });
            }
        })

        .on('close', () => {
            writeStream.destroy();
            fs.unlink(filepath, err => { // eslint-disable-line
                /* ignore error */
            });
        })
        .pipe(writeStream);

    writeStream
        .on('error', (err) => {
            if (err.code === 'EEXIST') {
                res.statusCode = 409;
                res.end('File exists');
            } else {
                if (!res.headersSent) {
                    res.writeHead(500, {'Connection': 'close'});
                    res.write('Internal error');
                }

                res.end();

                fs.unlink(filepath, err => { // eslint-disable-line
                    /* ignore error */
                });
            }
        })
        .on('close', () => {
            res.end('ОК');
        });
};
