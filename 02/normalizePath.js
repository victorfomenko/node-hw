const path = require('path');
const ROOT = `${__dirname}/files`;

module.exports = (filePath) => {
    let decodedPath = '';
    decodedPath = decodeURIComponent(filePath);

    if (filePath.indexOf('\0') !== -1) {
        throw new Error('Wrong filepath name');
    }

    const normalizedPath = path.normalize(path.join(ROOT, decodedPath));

    if (normalizedPath.indexOf(ROOT) !== 0 ) {
        throw new Error('Wrong filepath name');
    }
    return normalizedPath;
};
