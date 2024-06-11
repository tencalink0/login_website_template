import {promises as fsPromises} from 'fs';
import path from 'path';

const getHTMLTemplates = async (__dirname) => {
    let htmlTemplateDir = path.join(__dirname, "public");
    let filesRaw = await fsPromises.readdir(htmlTemplateDir);
    let files = await trimHTMLHeaders(filesRaw);
    return files;
};

function trimHTMLHeaders(filesRaw) {
    let files = [];
    filesRaw.forEach(fileRaw => {
        fileRaw = fileRaw.split('.');
        if (fileRaw[1] = 'html') {
            files.push(fileRaw[0]);
        }
    });
    return files;
}

async function readTextFile(fileName) {
    try {
        await fsPromises.access(fileName, fsPromises.constants.F_OK);
        const data = await fsPromises.readFile(fileName, 'utf8');
        return data.split('\n');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export {getHTMLTemplates, trimHTMLHeaders, readTextFile};