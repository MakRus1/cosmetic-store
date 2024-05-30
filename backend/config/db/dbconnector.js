import cfg from './dbconfig.js';
import odbc from 'odbc'

class Db {
    constructor() {}

    async query(ssql, params=[]) {
        return new Promise(res => {
            const connectionConfig = {
                connectionString: `DSN=CosmeticStoreODBC;UID=${cfg.bd.user};PWD=${cfg.bd.password};DATABASE=${cfg.bd.host}/${cfg.bd.port}:${cfg.bd.database};CHARSET=${cfg.bd.charset}`,
                connectionTimeout: 10,
                loginTimeout: 10
            }

            const connection = odbc.connect(connectionConfig, (error, connection) => {
                if (error) { console.log(error); res(error); }

                connection.query(ssql, params, (error, result) => {
                    if (error) { console.error(error); res(error); }

                    res(result);

                    connection.close((error) => {
                        if (error) { return; }
                    })
                });
            })
        });
    }
}

export const db = new Db();