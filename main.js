import http from 'http';
import url from 'url';
import path from 'path';
import fs from 'fs/promises';

import {getHTMLTemplates} from './basic_functions.js';
import {toHTMLFile} from './conversions.js';
import {User} from './objects.js';

const PORT = process.env.PORT;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
    const user = new User;
    user.ip = req.socket.remoteAddress.split(':').pop();
    user.name = 'Unknown';

    console.log(user.ip + ' :: ' + req.url);

    if (req.method === 'GET') {
        const htmlTemplatesList = await getHTMLTemplates(__dirname);

        if (req.url === '/') {
            res.setHeader('Content-Type', 'text/html');
            res.write('<h1> Hello World! </h1>');
        } else if (htmlTemplatesList.includes(req.url.slice(1))) {
            const htmlFileName = await toHTMLFile(__dirname, req.url);
            const htmlData = await fs.readFile(htmlFileName, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.write(htmlData);
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('<h2>Page Not Found</h2>');
        };
        res.end();
    } else {
        throw new Error('Method not allowed');
    };
    
});

console.log(PORT);
server.listen(8080, () => {
    console.log("Server Booted");
})