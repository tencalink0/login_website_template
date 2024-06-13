import path from 'path';
import {createHash} from 'crypto';

const toHTMLFile = async (__dirname, fileName) => {
    return path.join(__dirname, '..', 'public', fileName);
};

const toCSSFile = async (__dirname, fileName) => {
    return path.join(__dirname, '..', 'static', 'css', fileName);
};

const toJSFile = async (__dirname, fileName) => {
    return path.join(__dirname, '..', 'static', 'js', fileName);
};

const hash256 = async (string) => {
    let hash = createHash('sha256').update(string).digest('hex').slice(0, 32);
    return hash.slice(0, 32);
};

const hash256S = (string) => { //for synchronous uses (Promise)
    let hash = createHash('sha256').update(string).digest('hex').slice(0, 32);
    return hash.slice(0, 32);
};

export {toHTMLFile, toCSSFile, toJSFile, hash256, hash256S};