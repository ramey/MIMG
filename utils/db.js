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

const connection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            return resolve(conn);
        })
    });
}

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

exports.query = queryString => {
    return new Promise((resolve, reject) => {
        if (!pool) {
            return reject(new Error('Missing Database Connection'));
        }
        connection()
            .then(conn => runQuery(conn, queryString))
            .then((results, fields) => resolve(results, fields))
            .catch(err => reject(err))
    });
};