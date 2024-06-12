import http from 'http';
import url from 'url';
import path from 'path';

import {Templates, getHeader} from './basic_functions.js';
import {User} from './objects.js';
import {Database} from './database.js';
import {Request} from './requests.js'
import {toHTMLFile, toCSSFile, toJSFile} from './conversions.js';

const PORT = process.env.PORT;
const DBKEY = process.env.DBKEY; 

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
    const user = new User;
    user.ip = req.socket.remoteAddress.split(':').pop();
    user.name = 'Unknown';

    const database = new Database('./databases/logins.db');
    const request = new Request(req, res, database, user);

    if (req.method === 'GET') {
        const templates = new Templates();
        const htmlTemplates = await templates.html(__dirname);
        const cssTemplates = await templates.css(__dirname);
        const jsTemplates = await templates.js(__dirname);

        if (req.url === '/') {
            request.sendFile('public/index.html','html');
        } else if (getHeader(req.url) == 'html') { 
            if (htmlTemplates.includes(req.url.slice(1)) && req.url !== '/main.html') {
                const path = await toHTMLFile(__dirname, req.url);
                request.sendFile(path,'html');
            } else if (req.url === '/clearServer') {
                database.init(DBKEY)
            } else {
                request.notFound();
            };
        } else if (getHeader(req.url) == 'css') {
            if (cssTemplates.includes(req.url.slice(1))) {
                const path = await toCSSFile(__dirname, req.url.slice(1));
                request.sendFile(path, 'css');
            } else {
                request.notFound();
            }
        } else if (getHeader(req.url) == 'js') {
            if (jsTemplates.includes(req.url.slice(1))) {
                const path = await toJSFile(__dirname, req.url.slice(1));
                request.sendFile(path, 'js');
            } else {
                request.notFound();
            }
        } else {
            request.notFound();
        }
    } else {
        throw new Error('Method not allowed');
    };
    
});

server.listen(8081, () => {
    console.log("Server Booted: ", PORT);
})