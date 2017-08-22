/**
 * @file - utility file for db, currently mysql
 */
const mysql = require('mysql');

let connPool = null;

exports.connect = ({host, user, password, database, connectionLimit}) => {
    connPool = mysql.createPool({
        host,
        user,
        password,
        database,
        connectionLimit
    });
}

/**
 * @function - gets a connection from pool
 * @return {obj} Promise
 */
const connection = () => {
    return new Promise((resolve, reject) => {
        connPool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            return resolve(conn);
        })
    });
}

/**
 * @function - to run the query
 * @param {obj} connection object
 * @param {obj} query - query to be run 
 */
const runQuery = (conn, query) => {
    return new Promise((resolve, reject) => {
        conn.query(query, (err, results, fields) => {
            conn.release();
            if (err) {
                return reject(err)
            }
            return resolve(results, fields)
        })
    });
};

/**
 * @function - execute a db query, first get a connection and then run
 * @param {string} queryString - query to be run
 */
exports.query = queryString => {
    return new Promise((resolve, reject) => {
        if (!connPool) {
            return reject(new Error('Missing Database Connection'));
        }
        connection()
            .then(conn => runQuery(conn, queryString))
            .then((results, fields) => resolve(results, fields))
            .catch(err => reject(err))
    });
};