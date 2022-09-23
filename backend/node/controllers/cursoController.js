require('dotenv').config();
const sql = require('../connection.js');
const jwt = require('../utils/jwt.js');
const errorHandler = require('../utils/errorHandler.js');
const multer = require('multer');
//const Curso = require('../models/cursoModel.js');
//const User = require('../models/userModel.js');

exports.criar = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const user = await sql.query(`SELECT id,nome,email,senha,role FROM usuario WHERE id = $1;`,[token.sub]);
    if(user.rows.length == 0){
        throw new Error('USER_NOT_FOUND');
    }
    if(user.rows[0].role == 'aluno'){
        res.status(401).send('Alunos não podem criar cursos');
        return;
    }
    //colocar um switch pra verificar o tamanho(length) das strings
    const dataAtual = Date.now();
    //23505     curso ja existe
    await sql.query('BEGIN;');
    await sql.query(`INSERT INTO curso values (default, $1, $2, $3, $4, $5, $6);`,[req.body.titulo, req.body.tituloLongo, req.body.descricao, parseInt(req.body.preco * 100), req.body.categoria, dataAtual]);
    const resposta = await sql.query(`SELECT * from curso where titulo = $1 and data_criacao = $2`,[req.body.titulo, dataAtual]);
    await sql.query(`INSERT INTO cria_curso values ($1, $2);`,[user.rows[0].id, resposta.rows[0].id]);
    await sql.query('COMMIT;');
/*     const curso = new Curso({
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
 */
    res.status(201).send(JSON.stringify(resposta.rows[0]));
}catch(err){
    await sql.query('ROLLBACK;');
    errorHandler(err,req,res);
}
}

//update
exports.update = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const user = await sql.query(`SELECT id,nome,email,senha,role FROM usuario WHERE id = $1;`,[token.sub]);
    if(user.rows.length == 0){
        throw new Error('USER_NOT_FOUND');
    }
    const curso = await sql.query(`SELECT * FROM curso WHERE id = $1;`,[parseInt(req.body.id)]);
    if(curso.rows.length == 0){
        res.status(404).send(`Curso não encontrado`);
        return;
    }
 
/*     if(!user._id.equals(curso.criador)){
        res.status(401).send('Esse curso não pertence a esse usuário');
        return;
    } */
    const updatedCurso = {
        titulo:req.body.titulo??curso.rows[0].titulo,
        tituloLongo:req.body.tituloLongo??curso.rows[0].titulo_longo,
        descricao:req.body.descricao??curso.rows[0].descricao,
        categoria:req.body.categoria??curso.rows[0].categoria,
        preco:req.body.preco??curso.rows[0].preco
    }
    const resposta = await sql.query(`UPDATE curso SET titulo = $1, titulo_longo = $2, descricao = $3, categoria = $4, preco = $5 WHERE id = $6`,[updatedCurso.titulo, updatedCurso.tituloLongo, updatedCurso.descricao, updatedCurso.categoria, parseInt(updatedCurso.preco * 100), parseInt(req.body.id)])

    if(resposta.rowCount == 0){
        res.send('curso não encontrado');
        return;
    }
    res.send('Curso modificado');
}catch(err){
    errorHandler(err,req,res);
}
}
//terminar o resto
//delete
/* exports.delete = async function(req,res){
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
} */



/* cursos adquiridos */
exports.cursosAdquiridosImg = async function(req,res){
try{
    let caminhoBase = `D:\\SQL\\imagens\\cursos`;
    const b = '\\';
                                //req.query.id
    res.sendFile(caminhoBase + b + '0' + b + 'default-icon.png');
}catch(err){
    res.status(404).send('not found');
    console.log(err);
    //errorHandler(err,req,res);
}
}
/* dados do curso */
exports.cursosAdquiridosDados = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const query = await sql.query(`
    select c.id, c.titulo from usuario u
    inner join adquire_curso adc
    on u.id = adc.id_usuario
    inner join curso c
    on c.id = adc.id_curso
    where u.id = $1
    `,[token.sub]);//token.sub
   
    res.status(200).send(JSON.stringify(query.rows[req.body.curso]));
}catch(err){
    errorHandler(err,req,res);
}
}


exports.cursosAdquiridosCount = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);

    const query = await sql.query(`
    select u.nome from usuario u
    inner join adquire_curso adc
    on u.id = adc.id_usuario
    inner join curso c
    on c.id = adc.id_curso
    where u.id = $1`,[token.sub]);

    res.status(200).send(JSON.stringify(query.rowCount));
}catch(err){
    errorHandler(err,req,res);
}
}