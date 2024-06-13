import cookie from 'cookie';
import {hash256S} from '../utils/conversions.js';
import {Database} from '../db/database.js'

class Cookies {
    constructor(req, res, database) {
        this.req = req;
        this.res = res;
        this.now = new Date();
        this.database = database;
    }

    async set(username, password, userID) {
        const timeNow = this.now.toISOString().slice(0, 19).replace('T', ' ');
        const loginHash = await hash256(username + password + userID + timeNow);
        const passwordHash = await hash256(password); 
        
        this.res.setHeader('Set-Cookie', [
            `login=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/`,
            `password=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/`,
            `id=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/`
        ]);
        this.res.setHeader('Set-Cookie', [
            `login=${loginHash}; HttpOnly; Path=/`,
            `password=${passwordHash}; HttpOnly; Path=/`,
            `id=${userID}; HttpOnly; Path=/`
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
        const logins = await this.database.getFunc('SELECT * FROM logins;');
        const cookieID = await this.get('id');
        const cookiePassword = await this.get('password');

        return new Promise((resolve, reject) => {
            if (cookieID) {
                for (let i = 0; i < logins.length; i++) {
                    try {
                        if (logins[i].userID == cookieID) {
                            if (hash256S(logins[i].password) == cookiePassword) {
                                resolve(logins[i].username);
                                return;
                            }
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