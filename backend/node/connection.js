const Pool = require('pg').Pool;

const pool = new Pool({
   connectionString:'postgres://iqudlhms:WvoICcZ48ZMFonOIbyvx6mlU5JVUudHu@babar.db.elephantsql.com/iqudlhms'
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