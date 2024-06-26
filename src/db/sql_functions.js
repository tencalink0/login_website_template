import {Database} from "../db/database.js";

class SQL {
    constructor(database) {
        this.database = database;
    }


    async get(query) {
        switch (query) {
            case 'users':
                return await this.database.getFunc('SELECT logins.loginHash, users.username FROM logins JOIN users ON logins.userID = users.userID;'); 
            case 'userList':
                return await this.database.getFunc('SELECT * FROM users;');
        }
    }   

    async run(query, params) {
        switch (query) {
            case 'addLogin':
                await this.database.runFunc(`INSERT INTO logins (loginHash, userID) VALUES ('${params}')`).then(() => {return 0;});
                break;
            case 'logRequest':
                await this.database.runFunc(`INSERT INTO requests (ip, username, time, page) VALUES ('${params}')`).then(() => {return 0;});
                break;
            default:
                console.log('Unknown Query');
                return -1;
        }
    }

}

export {SQL}