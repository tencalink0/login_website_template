import cookie from 'cookie';
import {hash256, hash256S} from '../utils/conversions.js';

class Cookies {
    constructor(req, res, sql) {
        this.req = req;
        this.res = res;
        this.now = new Date();
        this.sql = sql;
    }

    async set(username, password, userID) {
        const timeNow = this.now.toISOString().slice(0, 19).replace('T', ' ');
        const loginHash = await hash256(username + password + timeNow);
        
        this.res.setHeader('Set-Cookie', [
            `loginHash=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/`
        ]);
        this.res.setHeader('Set-Cookie', [
            `loginHash=${loginHash}; HttpOnly; Path=/`
        ]);

        return loginHash;
    }

    async get(cookieName) {
        const rawCookies = this.req.headers.cookie;
        if (this.req.headers.cookie) {
            const cookies = await cookie.parse(this.req.headers.cookie);
            if (cookies[cookieName]) {
                return cookies[cookieName];
            } else {
                return null;
            } 
        } else {
            return null;
        }
    }

    async getAll() {
        const rawCookies = this.req.headers.cookie;
        if (await rawCookies) {
            return await cookie.parse(rawCookies);
        } else {
            return null;
        }
    }

    async getUsername() {
        const logins = await this.sql.get('users');
        const loginHash = await this.get('loginHash');

        return new Promise((resolve, reject) => {
            if (loginHash) {
                for (let i = 0; i < logins.length; i++) {
                    try {
                        if (logins[i].loginHash == loginHash) {
                            resolve(logins[i].username);
                            return;
                        } 
                    } catch (errs) {
                        resolve(null);
                        return;
                    }
                }
                resolve(null);
                return;
            } else {
                resolve(null);
                return;
            }
        });
    }
}

export {Cookies};