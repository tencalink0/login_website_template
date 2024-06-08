import path from 'path';

const toHTMLFile = async (__dirname, fileName) => {
    return path.join(__dirname, 'public', fileName + '.html');
};

export {toHTMLFile};