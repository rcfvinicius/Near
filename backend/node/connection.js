const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
   connectionString: process.env.PG_URI
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