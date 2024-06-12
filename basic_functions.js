import { exec } from 'child_process';
import {promises as fsPromises} from 'fs';
import path from 'path';

class Templates {
    async html(__dirname) {
        let htmlTemplateDir = path.join(__dirname, 'public');
        let files = await fsPromises.readdir(htmlTemplateDir);
        return files;
    }

    async css(__dirname) {
        let htmlTemplateDir = path.join(__dirname, 'static', 'css');
        let files = await fsPromises.readdir(htmlTemplateDir);
        return files;
    }

    async js(__dirname) {
        let htmlTemplateDir = path.join(__dirname, 'static', 'js');
        let files = await fsPromises.readdir(htmlTemplateDir);
        return files;
    }
}

function getHeader(request) {
    try{
        request = request.split('.');
        if (request.length == 2) {
            return request[1];
        } else {
            return ''; 
        }
    } catch {
        return '';
    }
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

export {Templates, getHeader, readTextFile};