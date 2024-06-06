import fs from 'fs/promises';
import path from 'path';

const getHTMLTemplates = async (__dirname) => {
    try {
        let htmlTemplateDir = path.join(__dirname, "public");
        let files = await fs.readdir(htmlTemplateDir);
        return files;
    } catch (err) {
        throw new Error('Error reading html templates.')
    };
};

export {getHTMLTemplates};