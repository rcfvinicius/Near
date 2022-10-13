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
    //colocar um switch pra verificar o tamanho(length) das strings
    const dataAtual = Date.now();
    //23505     curso ja existe
    await sql.query(`INSERT INTO curso values (default, $1, $2, $3, $4, $5, $6, $7)`,[token.sub, req.body.titulo, req.body.tituloLongo, req.body.descricao, parseInt(req.body.preco * 100), req.body.categoria, dataAtual]);
    const resposta = await sql.query(`select id from curso where data_criacao = $1`,[dataAtual]);

    res.status(201).send(JSON.stringify(resposta.rows[0]));
}catch(err){
    //await sql.query('ROLLBACK;');
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

/*     const query = await sql.query(`
    select c.titulo from usuario u
    inner join cria_curso cc
    on u.id = cc.id_usuario
    inner join curso c
    on c.id = cc.id_curso
    where u.id = $1;`,[token.sub]); */

    const query = await sql.query(`
    select titulo from curso
    where id_usuario = $1
    `,[token.sub]);

    res.status(200).send(JSON.stringify(query.rowCount));
}catch(err){
    errorHandler(err,req,res);
}
}

exports.cursosCriadosDados = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
/*     const query = await sql.query(`
    select c.id, c.titulo from usuario u
    inner join cria_curso cc
    on u.id = cc.id_usuario
    inner join curso c
    on c.id = cc.id_curso
    where u.id = $1;
    `,[token.sub]);//token.sub */

    const query = await sql.query(`
    select id, titulo from curso
    where id_usuario = $1
    `,[token.sub]);

    res.status(200).send(JSON.stringify(query.rows[req.body.curso]));
}catch(err){
    errorHandler(err,req,res);
}
}

//

exports.buscarVideoAulas = async function(req,res){
try{//http://localhost:8000/curso/buscarVideoAulas?idCurso=37
    const token = await jwt.verificar(req.headers['x-access-token']);
    //verificar se o usuário possui ou criou o curso
    const query1 = await sql.query(`
    select id_usuario from adquire_curso
    where id_usuario = $1
    and id_curso = $2
    `,[token.sub, req.query.idCurso]);

    if(query1.rowCount == 0){
        const query2 = await sql.query(`
        select id_usuario from curso
        where id_usuario = $1
        and id = $2
        `,[token.sub, req.query.idCurso]);
        if(query2.rowCount == 0){
            res.status(403).send('Usuário não possui este curso!')
            return;
        }
    }
/*     const resposta = await sql.query(`
        select aula.cod, aula.id, aula.nome from video_aula aula
        inner join cria_aula ca
        on aula.id = ca.id_aula
        where ca.id_curso = $1
        `,[req.query.idCurso]); */

    const resposta = await sql.query(`
    select cod, id, nome from video_aula
    where id_curso = $1
    `,[req.query.idCurso])


    const ordem = await sql.query(`select ordem from curso where id = $1`,[req.query.idCurso]);
    if(req.query.mode == 'all'){
        res.status(200).send(JSON.stringify([ordem.rows[0].ordem,resposta.rows]));
        return;
    }
    
    if(ordem.rows[0].ordem == null){
        res.status(200).send(JSON.stringify(resposta.rows));
        return;
    }

    let ordemAulas = ordem.rows[0].ordem.split(';');

    const ordemFinal = [];
    let i = 0;
    let limit = 0;
    while(i < ordemAulas.length-1 && limit < 9999){
        for(let e=0;e<resposta.rows.length;e++){
            if(resposta.rows[e].id == parseInt(ordemAulas[i])){
                ordemFinal.push(resposta.rows[e]);
                i++;
            }
        }
        limit++;
    }

    res.status(200).json(ordemFinal);
}catch(err){
    errorHandler(err,req,res);
}
}

exports.criarVideoAula = async function criarVideoAula(req,res){
try{
    //idCurso, link, nome
    const token = await jwt.verificar(req.headers['x-access-token']);
    /*     const query = await sql.query(`
    select id_usuario from cria_curso
    where id_usuario = $1
    and id_curso = $2
    `,[token.sub, req.body.idCurso]); */
    
    //verificar se o usuário criou o curso
    const query = await sql.query(`
    select id_usuario from curso
    where id_usuario = $1
    and id = $2
    `,[token.sub, req.body.idCurso]);

    if(query.rowCount == 0){
        res.status(403).send('Usuário não é o criador deste curso!');
        return;
    }
    const link = req.body.link;
    let cod;
    if(link.split('//')[1].split('/')[0] == 'youtu.be'){
        cod = link.split('//')[1].split('/')[1];
    }else{
        cod = link.split('v=')[1].split('&')[0];
    }

    await sql.query(`INSERT INTO video_aula values (default, $1, $2, $3)`,[req.body.idCurso, req.body.nome, cod]);
/* 
    await sql.query('BEGIN;');
    await sql.query(`INSERT INTO video_aula values(default, $1, $2);`,[req.body.nome, cod]);
    const resposta = await sql.query(`select id from video_aula where nome = $1 and cod = $2 order by id desc limit 1;`,[req.body.nome, cod]);
    await sql.query(`INSERT INTO cria_aula values($1, $2)`,[resposta.rows[0].id, req.body.idCurso]);
    await sql.query('COMMIT;');
 */
    res.status(201).send('criado');

}catch(err){
    //await sql.query('ROLLBACK;')
    errorHandler(err,req,res);
}
}

exports.ordenar = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    //verificar se o usuário criou o curso
    const query = await sql.query(`
    select id_usuario from curso
    where id_usuario = $1
    and id = $2
    `,[token.sub, req.body.idCurso]);
    if(query.rowCount == 0){
        res.status(403).send('Usuário não é o criador deste curso!');
        return;
    }

    await sql.query(`update curso set ordem = $1 where id = $2`,[req.body.ordem, req.body.idCurso]);
    res.status(200).send('ok');
}catch(err){
    errorHandler(err,req,res);
}
}

exports.verificarCriador = async function(req,res){
try{
    //idCurso
    const token = await jwt.verificar(req.headers['x-access-token']);
    /*     const query1 = await sql.query(`
    select id_usuario from cria_curso
    where id_usuario = $1
    and id_curso = $2
    `,[token.sub, req.query.idCurso]); */

    //verificar se o usuário criou o curso
    const query1 = await sql.query(`
    select id_usuario from curso
    where id_usuario = $1
    and id = $2
    `,[token.sub, req.query.idCurso]);

    if(query1.rowCount == 0){
        res.status(403).json({criador:false});
        return;
    }
    res.status(200).json({criador:true});


}catch(err){
    errorHandler(err,req,res);
}
}