import http from 'http';
import url from 'url';
import path, { resolve } from 'path';

import {Templates, getHeader} from './utils/basic_functions.js';
import {toHTMLFile, toCSSFile, toJSFile, hash256} from './utils/conversions.js';
import {User} from './models/objects.js';
import {Database} from './db/database.js';
import {SQL} from './db/sql_functions.js'
import {Request} from './services/requests.js';
import {Cookies} from './services/cookies.js';

const PORT = process.env.PORT;
const DBKEY = process.env.DBKEY; 
const DBPATH = process.env.DBPATH;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
    if (req.url != '/favicon.ico') {
        const database = new Database(DBPATH);
        const sql = new SQL(database);
        const user = new User;
        const cookies = new Cookies(req, res, sql);

        user.ip = req.socket.remoteAddress.split(':').pop();
        await cookies.getUsername().then(username => {user.name = username}).catch(err => {console.log('Error: ', err)});

        const request = new Request(req, res, sql, user);

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
                const logins = await sql.get('userList');
                const loginID = await checkDetails(logins, bodyContent).catch(error => {console.log(error)});

                if (loginID == 0) {
                    console.log('Login: ', await cookies.get('login'));
                    console.log('Pass: ', await cookies.get('password'));
                    console.log('ID: ', await cookies.get('id'));

                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(JSON.stringify({success: false, message: 'Login Unsuccessful'}));
                } else {
                    const loginHash = await cookies.set(bodyContent.username, bodyContent.password, loginID);
                    await sql.run('addLogin', loginHash + `', '` + loginID);
                    
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(JSON.stringify({success: true, message: 'Login Successful'}));
                }
            } else {
                request.notFound();
            }
        } else {
            throw new Error('Method not allowed');
        };
    }
});

server.listen(8081, () => {
    console.log("Server Booted: ", PORT);
})