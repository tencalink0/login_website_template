import fs from 'fs/promises';
import path from 'path';

const getHTMLTemplates = async (__dirname) => {
    let htmlTemplateDir = path.join(__dirname, "public");
    let filesRaw = await fs.readdir(htmlTemplateDir);
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

export {getHTMLTemplates};