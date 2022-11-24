const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'near',
    password: '0000',
    port: 5432,
});


exports.query = (qry,params=undefined) => {
    return new Promise((resolve,reject)=>{
       pool.query(qry, params, (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
       });
    })
 }