import http from 'http';
import url from 'url';
import path, { resolve } from 'path';

import {Templates, getHeader} from './basic_functions.js';
import {User} from './objects.js';
import {Database} from './database.js';
import {Request} from './requests.js'
import {toHTMLFile, toCSSFile, toJSFile, hash256} from './conversions.js';

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
        } else if (req.url === '/clearServer') {
            database.init(DBKEY)
        } else {
            request.notFound();
        }
    } else if (req.method === 'POST') {
        if (req.url == '/login') {
            const getBodyData = () => {
                return new Promise((resolve, reject) => {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk.toString();
                    });
                    req.on('end', () => {
                        const parsedBody = JSON.parse(body);
                        resolve(parsedBody);
                    });
                    req.on('error', (err) => {
                        reject(err);
                    });
                });
            };

            const checkDetails = (logins, bodyContent) => {
                return new Promise((resolve, reject) => {
                    let loginID = 0;
                    for (let i = 0;i < logins.length; i++) {
                        if (logins[i].username == bodyContent.username) {
                            if (logins[i].password == bodyContent.password) {
                                loginID = logins[i].userID;
                                resolve(loginID);
                            }
                        } 
                    }
                    resolve(loginID);
                });
            };

            const bodyContent = await getBodyData();
            const logins = await database.getFunc('SELECT * FROM logins;')
            const loginID = await checkDetails(logins, bodyContent).catch(error => {console.log(error)});

            console.log('BODY CONT: ', bodyContent);
            console.log(logins);
            console.log(loginID);

            if (loginID == 0) {
                console.log('Login: ', await request.getCookie('login'));
                console.log('Pass: ', await request.getCookie('password'));

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(JSON.stringify({success: false, message: 'Login Unsuccessful'}));
            } else {
                const loginHash = await request.setCookie(bodyContent.username, bodyContent.password, loginID);
                await database.runFunc(`UPDATE logins SET unique_key = '${loginHash}' WHERE userID = ${loginID}`);
                
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(JSON.stringify({success: true, message: 'Login Successful'}));
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