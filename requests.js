import fs from 'fs/promises';
import cookie from 'cookie';

import {getHeader} from './basic_functions.js';
import {hash256} from './conversions.js';

class Request {
    constructor(req, res, database, user) {
        this.req = req
        this.res = res
        this.database = database
        this.user = user

        this.now = new Date();
    }

    async sendFile(path, type) {
        const fileData = await fs.readFile(path, 'utf8');
        this.res.setHeader('Content-Type', `text/${type}`);
        this.res.write(fileData);
        const timeNow = this.now.toISOString().slice(0, 19).replace('T', ' ');
        if (getHeader(path) == 'html') {
            this.database.runFunc(`INSERT INTO requests (ip, username, time, page) VALUES ('${this.user.ip}', '${this.user.name}','${timeNow}','${this.req.url}')`);
            console.log("\x1b[32m" + this.user.ip + ' :: ' + this.req.url + "\x1b[0m");
        }    
        this.res.end();
    }

    async notFound() {
        this.res.writeHead(404, {'Content-Type': 'text/html'});
        this.res.write('<h2>Page Not Found</h2>');
        console.log("\x1b[31m" + this.user.ip + ' :: ' + this.req.url + "\x1b[0m");
        this.res.end();
    } 

    async setCookie(username, password, userID) {
        const timeNow = this.now.toISOString().slice(0, 19).replace('T', ' ');
        const loginHash = await hash256(username + password + userID + timeNow);
        const passwordHash = await hash256(password); 
        
        this.res.setHeader('Set-Cookie', [
            `login=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/`,
            `password=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/`
        ]);
        this.res.setHeader('Set-Cookie', [
            `login=${loginHash}; HttpOnly; Path=/`,
            `password=${passwordHash}; HttpOnly; Path=/`
        ]);

        return loginHash;
    }

    async getCookie(cookieName) {
        const cookies = await cookie.parse(this.req.headers.cookie);
        if (cookies[cookieName]) {
            return cookies[cookieName];
        } else {
            return false;
        } 
    }
}

export {Request}