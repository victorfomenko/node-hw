const fs = require('fs');
const normalizePath = require('./normalizePath');

module.exports = (filePath, req, res) => {
    let path = '';

    try {
        path = normalizePath(filePath);
    } catch (e) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
    }

    fs.stat(path, (err, stats) => {
        if (err) {
            res.statusCode = 400;
            res.end('Bad request');
            return;
        }
        if (stats.isFile()) {
            res.statusCode = 409;
            res.end('File already exist');
            return;
        }
    });

    writeFile(path, res, req);
};


const writeFile = (filePath, res, req) => {
    const file = new fs.WriteStream(filePath);
    let body = '';

    req.on('readable', ()=>{
        const data = req.read();
        if (data) {
            body += data;
            if (body.length > 1e6) {
                res.statusCode = 413;
                res.end('File too big');
                req.destroy();
                fs.unlink(filePath, (error)=> {
                    console.log('filed remove file:', error);
                    return;
                });
                return;
            }
            file.write(data);
        }
    });

    req.on('error', () => {
        res.statusCode = 500;
        res.end('Server error');
        req.destroy();
        fs.unlink(filePath, (error) => {
            console.log('filed to remove file:', error);
            return;
        });
        return;
    });

    req.on('end', () => {
        res.end('ОК');
        return;
    });

    req.on('close', () => {
        req.destroy();
        fs.unlink(filePath, (error) => {
            console.log('filed to remove file:', error);
            return;
        });
    });
};
