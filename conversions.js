import path from 'path';

const toHTMLFile = async (__dirname, fileName) => {
    return path.join(__dirname, 'public', fileName);
};

const toCSSFile = async (__dirname, fileName) => {
    return path.join(__dirname, 'static', 'css', fileName);
};

const toJSFile = async (__dirname, fileName) => {
    return path.join(__dirname, 'static', 'js', fileName);
};

export {toHTMLFile, toCSSFile, toJSFile};