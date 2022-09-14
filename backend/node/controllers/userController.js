require('dotenv').config();
//const User = require('../models/userModel.js');
const sql = require('../connection.js');
const bc = require('bcrypt');
const jwt = require('../utils/jwt.js');
const errorHandler = require('../utils/errorHandler.js');

exports.login = async function(req,res){
try{
    const user = await sql.query(`SELECT id,nome,email,senha,role FROM usuario WHERE email = $1;`,[req.body.email]);
    if(user.rows.length == 0){ //caso nao encontre um email
        throw new Error('USER_DONT_MATCH');
    }
    if(!req.body.senha){//caso a não passe a senha
        throw new Error('PASSWORD_IS_UNDEFINED');
    }
    const passMatch = await bc.compare(req.body.senha, user.rows[0].senha);

    if(passMatch){
        const jwtData ={
            sub:user.rows[0].id,
            nome:user.rows[0].nome,
            email:user.rows[0].email,
            role:user.rows[0].role,
            exp:Math.floor(Date.now() / 1000) + 900
        };
        let token = await jwt.criar(jwtData);
        res.status(200).send(token);
        //res.status(200).send('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsIm5vbWUiOiJ2aW5pY2l1cyIsImVtYWlsIjoidmluaWNpdXN2dnYyQGdtYWlsLmNvbSIsInJvbGUiOiJwcm9mZXNzb3IiLCJleHAiOjE2NjI5MTk2NTMsImlhdCI6MTY2MjkxOTM1M30.fRzUzncx8VteVQ3W1Qq-xGvIqlzWT9iA0euI3xUuFvk');
        return;
    }
    res.status(401).send('Senha incorreta');
    //usuário:user._id
    //res.redirect('https://www.google.com.br/');
    
}catch(err){
/*     console.log(err);
    if(err == 'Error: USER_NOT_FOUND'){//email
        res.status(400).send('Email ou senha inválidos');
        return;
    }
    if(err == 'Error: PASSWORD_IS_UNDEFINED'){
        res.status(400).send('Bad request');
        return;
    }
    res.status(500).send('Internal Server Error'); */
    errorHandler(err,req,res);
}
}



//CADASTRO (CREATE)
exports.cadastro = async function(req,res){
try{
    if(!req.body.senha){ //caso a não passe a senha
        throw new Error('PASSWORD_IS_UNDEFINED');
    }
    req.body.senha = bc.hashSync(req.body.senha, 10);

    const resposta = await sql.query(`INSERT INTO usuario (nome, email, senha, role) VALUES ($1, $2, $3, $4);`,[req.body.nome, req.body.email, req.body.senha, req.body.role]);
    
    if(resposta.code == '23505'){
        res.status(400).send('email ja existe');
        return;
    }
    //const doc = await user.save();
    res.status(201).send('criado');
    
}catch(err){
/*     console.log(err);
    if(err._message){//erro no banco
        if(err._message == 'User validation failed'){//dados incorretos
            res.status(400).send('Alguns dados inseridos são inválidos');
            return;
        }
        //outros erros de banco
        res.status(400).send('Erro na criação do usuário');
        return;
    }
    if(err == 'Error: PASSWORD_IS_UNDEFINED'){//erro na senha
        res.status(400).send('Senha precisa ser passada');
        return;
    }
    if(err.code == 11000){
        res.status(400).send('Email duplicado');
        return;
    }
    //genérico
    res.status(500).send('Internal Server Error'); */
    errorHandler(err,req,res);
}
}




//DELETE
exports.delete = async function(req,res){
try{
    const user = await sql.query(`SELECT id FROM usuario WHERE email = $1`,[req.params.userEmail]);
    if(user.rows.length == 0){
        throw new Error('USER_NOT_FOUND');
    }

    let userId = await jwt.verificar(req.headers['x-access-token']);
    if(userId.sub == user.rows[0].id){
        await sql.query(`DELETE FROM usuario WHERE id = $1`,[user.rows[0].id]);
        res.status(200).send('Usuário deletado: '+user);
        return;
    }
    res.status(401).send('Token para o usuário errado');

}catch(err){
/*     console.log(err);
    if(err == 'Error: USER_NOT_FOUND'){//email
        res.status(404).send('Usuário não encontrado');
        return;
    }
    res.status(500).send('Internal Server Error'); */
    errorHandler(err,req,res);
}
}




//UPDATE

exports.update = async function(req,res){
try{
    const user = await sql.query(`SELECT id,nome,email,senha,role FROM usuario WHERE email = $1;`,[req.body.email]);
    if(user.rows.length == 0){
        throw new Error('USER_NOT_FOUND');
    }
    let userId = await jwt.verificar(req.headers['x-access-token']);
    if(userId.sub == user.rows[0].id){
        req.body.senha = bc.hashSync(req.body.senha??user.rows[0].senha, 10);
        const updatedUser = {
            nome:req.body.nome??user.rows[0].nome,
            email:req.body.email??user.rows[0].email,
            senha:req.body.senha??user.rows[0].senha,//
            role:req.body.role??user.rows[0].role
        }
        const resposta = await sql.query(`UPDATE usuario SET nome = $1, email = $2, senha = $3, role = $4 WHERE id = $5`,[updatedUser.nome, updatedUser.email, updatedUser.senha, updatedUser.role, user.rows[0].id])
        console.log(resposta)
/*         
        let newUser = await User.findOne({email:req.body.email??req.params.userEmail})
        const jwtData = {
            sub:newUser._id,
            nome:newUser.nome,
            sobrenome:newUser.sobrenome,
            email:newUser.email,
            role:newUser.role,
            exp:Math.floor(Date.now() / 1000) + 300
        }
        let token = await jwt.criar(jwtData);
        res.send(newUser+'Novo token: '+token);
 */
        res.status(200).send('Usuario atualizado!')
        return;
    }
    res.status(401).send('Token para o usuário errado');

}catch(err){
/*     console.log(err);
    if(err == 'Error: USER_NOT_FOUND'){
        res.status(400).send('Usuário não encontrado');
        return;
    }
    */
    res.status(500).send('Internal Server Error');
}
}

//verificar token e devolver o objeto
exports.token = async function(req,res){
try{
    console.log('/token')
    const token = await jwt.verificar(req.headers['x-access-token']);
    res.status(200).json(token);

    //setTimeout(()=>{},4000)
}catch(err){
    errorHandler(err,req,res);
}
}





//get all
exports.all = async function(req,res){
try{
/*     let docs = await User.find({});
    res.status(200).send(docs); */
    res.send('ok')
    
    setTimeout(()=>{
        console.log('r')
    },5000)
}catch(err){
    errorHandler(err,req,res);
}
}


//token válido
exports.tokenValido = async function(req,res){
    const jwtData ={
        sub: '62cb17b0ffe618798d497548',
        nome:'nome artificial',
        email:'exemplo@gmail.com',
        role:'admin',
        tokenInfo:'token artificial',
        exp:Math.floor(Date.now() / 1000) + 900
    } 
    const token = await jwt.criar(jwtData);
    console.log(token);
    res.status(200).send(token);
}

//
exports.redirect = async function(req,res){

    console.log(req.body)


    res.send('n')
    
    
    /*
    const user = await User.findOne({email:req.query.email});
    if(!user){
        res.status(301).redirect('http://localhost:3000/')
        return;
    }
    const passMatch = await bc.compare(req.query.senha, user.senha);
    if(passMatch){
        return res.status(301).send(user.nome)
    }
    res.status(301).redirect('http://localhost:3000/')
    */
}