require('dotenv').config();
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController.js');

exports.criar = function(jwtData){//passar o objeto    await jwt.criar(jwtData)
    return new Promise((resolve,reject)=>{
        jwt.sign(jwtData,process.env.SECRET,{algorithm:'HS256'},(err,token)=>{
            if(err){
                reject(new Error('TOKEN_ERROR'));
            }
            resolve(token);
        });
    })
}
/* 
const token = jwt.sign(user, SECRET, {
    // definindo tempo de expiração do token para 24 horas
    expiresIn: 86400
  });
 */

let verificar = function(token){//passar o token    await jwt.verificar(token)
    return new Promise((resolve,reject)=>{
        jwt.verify(token,process.env.SECRET,(err,decoded)=>{
            if(err){
                reject(new Error('TOKEN_VERIFICATION_ERROR'));
            }
            resolve(decoded);//{ sub: 'id do usuario', exp: 1657383833, iat: 1657383533 }
        });
    })
}
exports.verificar = verificar;
exports.autenticar = async function(req,res,next){
try{
    await verificar(req.headers['x-access-token']);
    next();
    //usuário:payload.sub
}catch(err){
    console.log(err);
    res.status(500).send('Internal Server Error');
}
}
/* 
const jwtData ={
    sub:'id do usuario',
    exp:Math.floor(Date.now() / 1000) + 300
} 
*/