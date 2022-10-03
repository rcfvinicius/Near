require('dotenv').config();
const sql = require('../connection.js');
const jwt = require('../utils/jwt.js');
const errorHandler = require('../utils/errorHandler.js');
const multer = require('multer');
const fs = require('fs');
//const Curso = require('../models/cursoModel.js');
//const User = require('../models/userModel.js');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try{
        await jwt.verificar(req.query.jwt);
        console.log('multer: ')
        console.log(req.query.id);
        const caminho = 'D:\\SQL\\imagens\\cursos\\';

        fs.access(caminho+req.query.id,(err)=>{
            if(err){
               fs.mkdir(caminho+req.query.id,(err)=>{
                  if(err){
                    throw new Error('MKDIR_ERROR');
                  }
                  cb(null, caminho+req.query.id+'\\');
               })
            }else{
                cb(null, caminho+req.query.id+'\\');
            }
          })
        }catch(err){
            console.log(err)
        }
    },
    filename: function (req, file, cb) {
        cb(null, 'default-course.png');
    }
 });

exports.upload = multer({ storage });


exports.criar = async function(req,res){
try{
    console.log('criar: ')
    console.log(req.body)
    const token = await jwt.verificar(req.headers['x-access-token']);
    
    const user = await sql.query(`SELECT id,nome,email,senha,role FROM usuario WHERE id = $1;`,[token.sub]);
    if(user.rows.length == 0){
        throw new Error('USER_NOT_FOUND');
    }
/*     if(user.rows[0].role == 'aluno'){
        res.status(401).send('Alunos não podem criar cursos');
        return;
    } */
    //colocar um switch pra verificar o tamanho(length) das strings
    const dataAtual = Date.now();
    //23505     curso ja existe
    await sql.query('BEGIN;');
    await sql.query(`INSERT INTO curso values (default, $1, $2, $3, $4, $5, $6);`,[req.body.titulo, req.body.tituloLongo, req.body.descricao, parseInt(req.body.preco * 100), req.body.categoria, dataAtual]);
    const resposta = await sql.query(`SELECT * from curso where titulo = $1 and data_criacao = $2`,[req.body.titulo, dataAtual]);
    await sql.query(`INSERT INTO cria_curso values ($1, $2);`,[user.rows[0].id, resposta.rows[0].id]);
    await sql.query('COMMIT;');

    req.curso = resposta.rows[0];
    req.idCurso = resposta.rows[0].id;
    res.status(201).send(JSON.stringify(resposta.rows[0]));

/*     req.curso = req.titulo;
    req.idCurso = 99
    res.status(201).send(JSON.stringify({id:'21'})) */
    //next();
}catch(err){
    await sql.query('ROLLBACK;');
    errorHandler(err,req,res);
}
}

exports.finalizarCadastro = function(req,res){
    console.log(req.body)
    res.status(201).send(JSON.stringify(req.curso));
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
    const caminhoBase = `D:\\SQL\\imagens\\cursos`;
    const b = '\\';
    fs.access(caminhoBase+b+req.query.id+b+'default-course.png',(err)=>{
        //console.log(req.query)
        if(err){
            res.sendFile(caminhoBase + b + '0' + b + 'default-course.png');
            return;
        }
        res.sendFile(caminhoBase + b + req.query.id + b + 'default-course.png');
    })
    
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

/* cursos criados */
exports.cursosCriadosCount = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);

    const query = await sql.query(`
    select c.titulo from usuario u
    inner join cria_curso cc
    on u.id = cc.id_usuario
    inner join curso c
    on c.id = cc.id_curso
    where u.id = $1;`,[token.sub]);

    res.status(200).send(JSON.stringify(query.rowCount));
}catch(err){
    errorHandler(err,req,res);
}
}

exports.cursosCriadosDados = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const query = await sql.query(`
    select c.id, c.titulo from usuario u
    inner join cria_curso cc
    on u.id = cc.id_usuario
    inner join curso c
    on c.id = cc.id_curso
    where u.id = $1;
    `,[token.sub]);//token.sub
    
    res.status(200).send(JSON.stringify(query.rows[req.body.curso]));
}catch(err){
    errorHandler(err,req,res);
}
}