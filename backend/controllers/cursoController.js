require('dotenv').config();
const Curso = require('../models/cursoModel.js');
const User = require('../models/userModel.js');
const jwt = require('../utils/jwt.js');
const errorHandler = require('../utils/errorHandler.js')

exports.criar = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const user = await User.findOne({_id:token.sub});
    if(!user){
        throw new Error('USER_NOT_FOUND');
    }
    if(user.role == 'aluno'){
        res.status(401).send('Alunos não podem criar cursos');
        return;
    }
    const curso = new Curso({
        criador:user._id,
        titulo: req.body.titulo,
        tituloLongo:req.body.tituloLongo??'',
        descricao:req.body.descricao??'',
        categoria:req.body.categoria??'',
        preco:req.body.preco
    });
    const doc = await curso.save();
    const cursos = user.cursos + curso._id + ';';
    await User.updateOne({email:user.email},{cursos:cursos});

    res.send(doc);
}catch(err){
    errorHandler(err,req,res);
}
}

//update
exports.update = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const user = await User.findOne({_id:token.sub});
    if(!user){
        throw new Error('USER_NOT_FOUND');
    }
    const curso = await Curso.findOne({titulo:req.params.curso});
    if(!curso){
        res.status(404).send(`Curso ${req.params.curso} não encontrado`);
        return;
    }
 
    if(!user._id.equals(curso.criador)){
        res.status(401).send('Esse curso não pertence a esse usuário');
        return;
    }
    const updatedCurso = {
        tituloLongo:req.body.tituloLongo,
        descricao:req.body.descricao,
        categoria:req.body.categoria,
        preco:req.body.preco       
    }
    await Curso.updateOne({titulo:req.params.curso},updatedCurso);

    res.send('Curso modificado');
}catch(err){
    errorHandler(err,req,res);
}
}

//delete
exports.delete = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const user = await User.findOne({_id:token.sub});
    if(!user){
        throw new Error('USER_NOT_FOUND');
    }
    if(user.role == 'aluno'){
        res.status(401).send('Alunos não podem atualizar cursos');
        return;
    }
    const curso = await Curso.findOne({titulo:req.params.curso});
    if(!curso){
        res.status(404).send(`Curso ${req.params.curso} não encontrado`);
        return;
    }
 
    if(!user._id.equals(curso.criador)){
        res.status(401).send('Esse curso não pertence a esse usuário');
        return;
    }

    await Curso.deleteOne({titulo:req.params.curso});
    res.status(200).send('Curso deletado'+curso);
    
}catch(err){
    errorHandler(err,req,res);
}
}

exports.all = async function(req,res){
try{
    let docs = await Curso.find({});
    res.status(200).send(docs);
}catch(err){
    errorHandler(err,req,res);
}
}