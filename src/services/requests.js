import fs from 'fs/promises';

import {getHeader} from '../utils/basic_functions.js';

class Request {
    constructor(req, res, sql, user) {
        this.req = req
        this.res = res
        this.sql = sql
        this.user = user

        this.now = new Date();
    }

    async sendFile(filePath, type) {
        const fileData = await fs.readFile(filePath, 'utf8');
        this.res.setHeader('Content-Type', `text/${type}`);
        this.res.write(fileData);
        const timeNow = this.now.toISOString().slice(0, 19).replace('T', ' ');
        if (getHeader(filePath) == 'html') {
            await this.sql.run('logRequest', this.user.ip + `', '` + this.user.name + `', '` + timeNow + `', '` + this.req.url);
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
}

export {Request}