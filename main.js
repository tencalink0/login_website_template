import http from 'http';
import url from 'url';
import path from 'path';
import {getHTMLTemplates} from './basic_functions.js';

const PORT = process.env.PORT;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
    try {
        if (req.method === 'GET') {
            if (req.url === '/') {
                res.setHeader('Content-Type', 'text/html');
                (async() => {
                    const htmlTemplatesList = await getHTMLTemplates(__dirname);
                    console.log(htmlTemplatesList);
                })();
                res.end('<h1> Hello World! </h1>');
            }
        } else {
            throw new Error('Method not allowed');
        }
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end();
    }
})

console.log(PORT);
server.listen(PORT, () => {
    console.log("Server Booted");
})