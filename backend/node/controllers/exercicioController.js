require('dotenv').config();
const sql = require('../connection.js');
const jwt = require('../utils/jwt.js');
const errorHandler = require('../utils/errorHandler.js');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try{
        await jwt.verificar(req.query.jwt);
        //console.log('multer: ')
        //console.log(req.query.id);
        const caminho = 'D:\\SQL\\imagens\\exercicios\\';

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
            console.log(err);
        }
    },
    filename: function (req, file, cb) {
        cb(null, 'default-exerc.png');
    }
 });

exports.upload = multer({ storage });


exports.criar = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    if(req.body.resposta3 == ''){
        req.body.resposta3=null;
    }
    if(req.body.resposta4 == ''){
        req.body.resposta4=null;
    }
    
    const verificar = await sql.query(`select id_usuario from curso where id_usuario = $1 and id = $2`,[token.sub, req.body.idCurso]);
    if(verificar.rows.length == 0){
        res.status(401).send('Usuário não é dono deste curso');
        throw new Error('UNAUTHORIZED');
    }
    const dataAtual = Date.now();
    await sql.query(`insert into exercicio values (default, $1, $2, $3, $4, $5, $6, $7, $8)`,[parseInt(req.body.idCurso), dataAtual, req.body.pergunta, req.body.resposta1, req.body.resposta2, req.body.resposta3, req.body.resposta4, req.body.resposta_correta]);
    const resposta = await sql.query(`select id from exercicio where data_criacao = $1`,[dataAtual]);

    return res.status(200).json({id:resposta.rows[0].id});

}catch(err){
    errorHandler(err,req,res);
}
}


exports.img = async function(req,res){
try{
    const caminhoBase = `D:\\SQL\\imagens\\exercicios`;
    const b = '\\';
    fs.access(caminhoBase+b+req.query.id+b+'default-exerc.png',(err)=>{
        if(err){
            res.status(404).send('Não encontrado');
            return;
        }
        res.sendFile(caminhoBase + b + req.query.id + b + 'default-exerc.png');
    })
}catch(err){
    errorHandler(err,req,res);
}
}

exports.buscarExercicios = async function(req,res){
try{//query.id_curso
    const token = await jwt.verificar(req.headers['x-access-token']);

    const resposta1 = await sql.query(`select * from adquire_curso where id_curso = $1 and id_usuario = $2`,[req.query.id_curso, token.sub]);
    if(resposta1.rows.length == 0){
        const resposta2 = await sql.query(`select id from curso where id = $1 and id_usuario = $2`,[req.query.id_curso, token.sub]);
        if(resposta2.rows.length == 0){
            throw new Error('Usuário não possui ou adquiriu este curso');
        }
    }

    const query = await sql.query(`select * from exercicio where id_curso = $1`,[req.query.id_curso]);

    res.status(200).json(query.rows);

}catch(err){
    errorHandler(err,req,res);
}
}

exports.buscarRespostas = async function(req,res){
try{//query.id_curso
    const token = await jwt.verificar(req.headers['x-access-token']);

    const query = await sql.query(`
    select e.id, fe.resposta, e.resposta_correta from faz_exercicio fe 
    inner join exercicio e on fe.id_exercicio = e.id
    where fe.id_usuario = $1 and e.id_curso = $2`,[token.sub, req.query.id_curso]);

    res.status(200).json(query.rows);

}catch(err){
    errorHandler(err,req,res);
}
}


exports.responder = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);

    let verificar = await sql.query(`
    select * from adquire_curso
    where id_usuario = $1
    and id_curso = $2
    `,[token.sub, req.body.idCurso]);

    if(verificar.rows.length == 0){
        verificar = await sql.query(`
        select id from curso
        where id_usuario = $1
        and id = $2
        `,[token.sub, req.body.idCurso]);
        if(verificar.rows.length == 0){
            throw new Error('Usuário não possui ou é dono deste curso!');
        } 
    }

    const respostas = req.body.respostas;
    for(let i=0;i<respostas.length;i++){
        await sql.query(`insert into faz_exercicio values($1, $2, $3)`,[token.sub, parseInt(respostas[i].id), respostas[i].resposta]);
    }

    res.status(201).json({status:'ok'});
}catch(err){
    errorHandler(err,req,res);
}
}