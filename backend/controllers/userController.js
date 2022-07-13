require('dotenv').config();
const User = require('../models/userModel.js');
const bc = require('bcrypt');
const jwt = require('../utils/jwt.js');
const errorHandler = require('../utils/errorHandler.js');

exports.login = async function(req,res){
try{
    const user = await User.findOne({email:req.body.email});
    if(!user){ //caso nao encontre um email
        throw new Error('USER_DONT_MATCH');
    }
    if(!req.body.senha){//caso a não passe a senha
        throw new Error('PASSWORD_IS_UNDEFINED');
    }
    const passMatch = await bc.compare(req.body.senha, user.senha);

    if(passMatch){
        const jwtData ={
            sub:user._id,
            nome:user.nome,
            sobrenome:user.sobrenome,
            email:user.email,
            role:user.role,
            exp:Math.floor(Date.now() / 1000) + 300
        };
        let token = await jwt.criar(jwtData);
        res.status(200).send(token);
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
    const user = new User({
        nome: req.body.nome,
        sobrenome:req.body.sobrenome,
        email:req.body.email,
        senha:req.body.senha,
        role:req.body.role
    });
    const doc = await user.save();
    res.status(201).send(doc);
    
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
    const user = await User.findOne({email:req.params.userEmail});
    if(!user){
        throw new Error('USER_NOT_FOUND');
    }
    let userId = await jwt.verificar(req.headers['x-access-token']);
    if(userId.sub == user._id){
        await User.deleteOne({email:req.params.userEmail});
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
    const user = await User.findOne({email:req.params.userEmail});
    if(!user){
        throw new Error('USER_NOT_FOUND');
    }
    let userId = await jwt.verificar(req.headers['x-access-token']);
    if(userId.sub == user._id){
        const updatedUser = {
            nome:req.body.nome??user.nome,
            sobrenome:req.body.sobrenome??user.sobrenome,
            email:req.body.email??user.email,
            senha:req.body.senha??user.senha,//
            role:req.body.role??user.role
        }
        await User.updateOne({email:req.params.userEmail}, updatedUser);
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
        return;
    }
    res.status(401).send('Token para o usuário errado');

}catch(err){
/*     console.log(err);
    if(err == 'Error: USER_NOT_FOUND'){
        res.status(400).send('Usuário não encontrado');
        return;
    }
    res.status(500).send('Internal Server Error'); */
    errorHandler(err,req,res);
}
}

//get all
exports.all = async function(req,res){
try{
    let docs = await User.find({});
    res.status(200).send(docs);
}catch(err){
    errorHandler(err,req,res);
}
}


//token válido
exports.token = async function(req,res){
    const jwtData ={
        sub: '62cb17b0ffe618798d497548',
        nome:'nome',
        email:'exemplo@gmail.com',
        role:'professor',
        tokenInfo:'token artificial',
        exp:Math.floor(Date.now() / 1000) + 900
    } 
    const token = await jwt.criar(jwtData);
    console.log(token);
    res.status(200).send(token);
}