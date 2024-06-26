import {SQL} from '../src/db/sql_functions.js';
import {Database} from '../src/db/database.js';

const sql = new SQL();
const database = new Database('../databases/logins.db');
(async => {
    database.runFunc('INSERT INTO logins (loginHash, userID) VALUES (3419349124, 1);');
})();