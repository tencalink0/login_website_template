'use strict';

import fs from 'fs';
import sqlite3 from 'sqlite3';
sqlite3.verbose();

import {readTextFile} from '../utils/basic_functions.js';

class Database {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Database connection failed');
            }
        });
    }
    async clear(key) { 
        const DBKEY = process.env.DBKEY; 
        if (DBKEY == key) {
            const tables = await this.getFunc("SELECT name FROM sqlite_master WHERE type='table'");
            for (let i=0; i < tables.length; i++) {
                if (tables[i].name != 'sqlite_sequence') {
                    this.runFunc(`DROP TABLE IF EXISTS ${tables[i].name}`);
                }
            }
        } else {
            console.log('Key provided does not match DBKEY');
        }
        return true;
    }

    async init(key) {
        let dbClearStat = await this.clear(key);
        if (dbClearStat) {
            const fileContents = await readTextFile('databases/db-init.sql');
            for (let i=0; i < fileContents.length; i++) {
                try {
                    await this.runFunc(fileContents[i]);
                } catch (err) {
                    throw new Error(err)
                }
            }
        } else {
            console.log('DB init failed');
        }
    }



    runFunc(sql) {
        return new Promise((resolve, reject) => {
            console.log("\x1b[33mSQL: " + sql + "\x1b[0m"); /*Uncomment this to get sql run functions displayed*/
            this.db.run(sql, (err) => {
                if (err) {
                    console.log("Database query failed ", err);
                    reject(err);
                    return;
                } else {
                    resolve();
                    return;
                }
            });
        });
    }

    getFunc(sql) {
        return new Promise((resolve, reject) => {
            //console.log("\x1b[34mSQL: " + sql + "\x1b[0m"); /*Uncomment this to get sql request functions displayed*/
            this.db.all(sql, (err, sqlData) => {
                if (err) {
                    console.log("Database query failed ", err);
                    reject(err);
                    return;
                } else {
                    resolve(sqlData);
                    return;
                }
            });
        });
    }
};

export {Database};