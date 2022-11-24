require('dotenv').config();
const sql = require('../connection.js');
const jwt = require('../utils/jwt.js');
const errorHandler = require('../utils/errorHandler.js');
const multer = require('multer');
const fs = require('fs');
const Carrinho = require('../models/carrinhoModel.js');
//const Curso = require('../models/cursoModel.js');
//const User = require('../models/userModel.js');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try{
        await jwt.verificar(req.query.jwt);
        //console.log('multer: ')
        //console.log(req.query.id);
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
            console.log(err);
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
    if(req.body.categoria == ''){
        req.body.categoria = null;
    }
    //colocar um switch pra verificar o tamanho(length) das strings
    const dataAtual = Date.now();
    //23505     curso ja existe
    await sql.query(`INSERT INTO curso values (default, $1, $2, $3, $4, $5, $6, $7, default, $8)`,[token.sub, req.body.titulo, req.body.tituloLongo, req.body.descricao, parseInt(req.body.preco * 100), req.body.categoria, dataAtual, req.body.aprendizado]);
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
/*     const user = await sql.query(`SELECT id,nome,email,senha,role FROM usuario WHERE id = $1;`,[token.sub]);
    if(user.rows.length == 0){
        throw new Error('USER_NOT_FOUND');
    } */
    const curso = await sql.query(`SELECT * FROM curso WHERE id = $1;`,[parseInt(req.body.idCurso)]);
    if(curso.rows.length == 0){
        res.status(404).send(`Curso não encontrado`);
        return;
    }
 
    if(curso.rows[0].id_usuario != token.sub){
        res.status(403).send(`Usuário não é dono deste curso!`);
        return;
    }

    
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



//delete
exports.delete = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    
    const query = await sql.query(`select * from adquire_curso where id_curso = $1 and id_usuario = $2`,[req.params.id, token.sub]);
    if(query.rows.length > 0){
        await sql.query(`delete from adquire_curso where id_curso = $1 and id_usuario = $2`,[req.params.id, token.sub]);
        res.status(200).json({status:'ok', desc:'deletado_curso_adquirido'});
    }else{
        await sql.query('BEGIN;');
        let query = await sql.query(`select ca.id from comentario_aula ca inner join video_aula va on va.id = ca.id_video_aula inner join curso c on c.id = va.id_curso where va.id_curso = $1 and c.id_usuario = $2`,[req.params.id, token.sub]);
        for(let i=0;i<query.rows.length;i++){
            await sql.query(`delete from comentario_aula where id = $1`,[query.rows[i].id]);
        }
        query = await sql.query(`select va.id from video_aula va inner join curso c on c.id = va.id_curso where c.id = $1`,[req.params.id]);
        for(let i=0;i<query.rows.length;i++){
            await sql.query(`delete from video_aula where id = $1`,[query.rows[i].id]);
        }
        query = await sql.query(`select id_usuario, id_exercicio from faz_exercicio fe inner join exercicio e on fe.id_exercicio = e.id where e.id_curso = $1`,[req.params.id]);
        for(let i=0;i<query.rows.length;i++){
            await sql.query(`delete from faz_exercicio where id_usuario = $1 and id_exercicio = $2`,[query.rows[i].id_usuario, query.rows[i].id_exercicio]);
        }

        await sql.query(`delete from exercicio where id_curso = $1`,[req.params.id]);
        await sql.query(`delete from curso where id = $1 and id_usuario = $2`,[req.params.id, token.sub]);

        await sql.query('COMMIT;');
        res.status(200).json({status:'ok', desc:'deletado_curso_criado'});
    }

}catch(err){
    await sql.query('ROLLBACK;');
    errorHandler(err,req,res);
}
}


/* cursos adquiridos */
exports.cursosAdquiridosImg = async function(req,res){
try{//query.id
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

exports.verificarAquisicao = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);

    let verificar = await sql.query(`
    select * from adquire_curso
    where id_usuario = $1
    and id_curso = $2
    `,[token.sub, req.query.idCurso]);

    if(verificar.rows.length == 0){
        verificar = await sql.query(`
        select id from curso
        where id_usuario = $1
        and id = $2
        `,[token.sub, req.query.idCurso]);
        if(verificar.rows.length == 0){
            throw new Error('Usuário não possui ou é dono deste curso!');
        } 
    }

    res.status(200).json({adquirido:true});

}catch(err){
    errorHandler(err,req,res);
}
}

exports.buscarComentarios = async function(req, res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    let verificar = await sql.query(`
    select * from adquire_curso
    where id_usuario = $1
    and id_curso = $2
    `,[token.sub, req.query.idCurso]);

    if(verificar.rows.length == 0){
        verificar = await sql.query(`
        select id from curso
        where id_usuario = $1
        and id = $2
        `,[token.sub, req.query.idCurso]);
        if(verificar.rows.length == 0){
            throw new Error('Usuário não possui ou é dono deste curso!');
        }
    }
    let verificar2 = await sql.query(`
    select id from video_aula 
    where id_curso = $1
    `,[req.query.idCurso]);

    let encontrado = false;
    //console.log(verificar2)

    for(let i=0;i<verificar2.rows.length;i++){
        if(verificar2.rows[i].id == req.query.id_video_aula){
            encontrado = true;
            break;
        }
    }
    if(!encontrado){
        throw new Error(`Nenhuma video aula com id ${req.query.id_video_aula} encontrada para este curso!`);
    }

    const query = await sql.query(`
    select ca.id, u.nome, ca.comentario, ca.data_comentario from comentario_aula ca
    inner join usuario u
    on ca.id_usuario = u.id
    where id_video_aula = $1 
    order by data_comentario desc
    `,[req.query.id_video_aula]);
    //query.rows[0].count
    res.status(200).send(JSON.stringify([query.rowCount, query.rows]));
}catch(err){
    errorHandler(err,req,res);
}
}





exports.comentar = async function(req, res){
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
    let verificar2 = await sql.query(`
    select id from video_aula 
    where id_curso = $1
    `,[req.body.idCurso]);

    let encontrado = false;
    for(let i=0;i<verificar2.rows.length;i++){
        if(verificar2.rows[i].id == req.body.id_video_aula){
            encontrado = true;
            break;
        }
    }
    if(!encontrado){
        throw new Error(`Nenhuma video aula com id ${req.body.id_video_aula} encontrada para este curso!`);
    }

    await sql.query(`INSERT INTO comentario_aula values(default, $1, $2, $3, $4)`,[req.body.id_video_aula, token.sub, req.body.comentario, Date.now()])

    res.status(201).send('criado');

}catch(err){
    errorHandler(err,req,res);
}
}

exports.updateVideoAula = async function(req, res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    console.log(req.body)
    let query = await sql.query(`
    select id from curso
    where id_usuario = $1
    and id = $2
    `,[token.sub, req.body.idCurso])

    if(query.rows.length == 0){
        res.status(404).send('Nenhum curso encontrado');
        return;
    }

    query = await sql.query(`
    select * from video_aula
    where id_curso = $1
    and id = $2
    `,[req.body.idCurso, req.body.id_video_aula]);

    if(req.body.nome == ''){
        req.body.nome = query.rows[0].nome
    }

    const link = req.body.link;
    let cod;
    if(link == ''){
        cod = query.rows[0].cod;
    }else{
        if(link.split('//')[1].split('/')[0] == 'youtu.be'){
            cod = link.split('//')[1].split('/')[1];
        }else{
            cod = link.split('v=')[1].split('&')[0];
        }
    }

    query = await sql.query(`
    update video_aula
    set nome = $1,
    cod = $2
    where id_curso = $3
    and id = $4
    `,[req.body.nome, cod, req.body.idCurso, req.body.id_video_aula]);


    res.status(200).send('modificado');
}catch(err){
    errorHandler(err,req,res);
}
}


exports.cursoInfo = async function(req, res){
try{
    const query = await sql.query(`
    select titulo_longo, descricao, preco, categoria, aprendizado from curso
    where id = $1;
    `,[req.query.id]);

    const query2 = await sql.query(`
    select count(id) from video_aula where id_curso = $1;
    `,[req.query.id]);

    res.status(200).json([query.rows[0], query2.rows[0].count]);
}catch(err){
    errorHandler(err,req,res);
}
}

exports.cursosPopulares = async function(req, res){
try{
    const query = await sql.query(`
    select id, titulo, descricao from curso
    order by data_criacao asc limit(5);
    `);

    res.status(200).json(query.rows);
}catch(err){
    errorHandler(err,req,res);
}
}

exports.adquirir = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const verificar = await sql.query(`select * from adquire_curso where id_usuario = $1 and id_curso = $2`,[token.sub, req.body.idCurso]);
    if(verificar.rows.length != 0){
        res.status(200).send('Usuário já possui este curso');
        return;
    }

    if(!req.body.idCurso || req.body.idCurso == ''){
        throw new Error('IDCURSO_IS_NOT_DEFINED');
    }
    const query = await sql.query(`INSERT INTO adquire_curso values($1, $2, $3)`,[token.sub, req.body.idCurso, Date.now()]);
    console.log(query);
    res.status(201).send('adquirido');
}catch(err){
    errorHandler(err,req,res);
}
}


exports.pesquisarTudo = async function(req, res){
try{
    if(req.query.q == '' || !req.query.q){
        res.status(400).json({cursos:[], usuarios:[], aulas:[]});
        return;
    }
    req.query.q = decodeURIComponent(req.query.q);
    req.query.q = '%' + req.query.q + '%';
    const cursos = await sql.query(`select id, titulo, descricao, categoria from curso where titulo_longo ilike $1`,[req.query.q]);
    const usuarios = await sql.query(`select id, nome from usuario where nome ilike $1`,[req.query.q]);
    const aulas = await sql.query(`select va.id, va.id_curso, va.nome, c.titulo from video_aula va inner join curso c on c.id = va.id_curso where va.nome ILIKE $1`,[req.query.q]);
    console.log(req.query)
    
    res.status(200).json({cursos:cursos.rows, usuarios:usuarios.rows, aulas:aulas.rows});
}catch(err){
    errorHandler(err,req,res);
}
}

exports.categorias = async function(req,res){
try{
    const query = await sql.query(`select id, titulo, categoria, preco from curso`);
    res.status(200).json(query.rows);
}catch(err){
    errorHandler(err,req,res);
}
}

/* carrinho */
exports.carrinhoSalvar = async function(req, res){
try{//item:'1'
    const token = await jwt.verificar(req.headers['x-access-token']);
    const user = await Carrinho.findOne({id_usuario:token.sub});
    if(!user){
        const carrinho = new Carrinho({
            id_usuario:token.sub,
            itens:req.body.item + ';'
        });
        await carrinho.save();
        return res.status(201).json({status:'ok', desc:'criado'});
    }
    //fazer um for pra verificar se tem o item no carrinho
    const novosItens = user.itens + req.body.item + ';';
    await Carrinho.updateOne({id_usuario:token.sub},{itens:novosItens});

    return res.status(200).json({status:'ok', desc:'atualizado'});

}catch(err){
    errorHandler(err,req,res);
}
}

exports.carrinhoLer = async function(req, res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const carrinho = await Carrinho.findOne({id_usuario:token.sub});
    if(!carrinho){
        return res.status(404).json({status:'err', desc:'nao encontrado'});
    }

    const itens = carrinho.itens.split(';');
    const itensAdquiridos = await sql.query(`select id_curso from adquire_curso where id_usuario = $1`,[token.sub]);

    for(let i=0;i<itensAdquiridos.rows.length;i++){
        for(let e=0;e<itens.length;e++){
            if(itensAdquiridos.rows[i].id_curso == itens[e]){
                const index = itens.indexOf(itens[e]);
                itens.splice(index, 1);
            }
        }
    }

    const dadosItens = new Array();
    for(let i=0;i<itens.length-1;i++){
        const query = await sql.query(`select id, titulo_longo, preco, categoria from curso where id = $1`,[parseInt(itens[i])]);
        dadosItens.push(query.rows[0]);
    }
  
    return res.status(200).json(dadosItens);
}catch(err){
    errorHandler(err,req,res);
}
}

exports.carrinhoDelete = async function(req, res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const carrinho = await Carrinho.findOne({id_usuario:token.sub});
    if(!carrinho){
        return res.status(404).json({status:'err', desc:'nao encontrado'});
    }
    //await Carrinho.deleteOne({id_usuario:token.sub});
    await Carrinho.updateOne({id_usuario:token.sub},{itens:''});

    return res.status(200).json({status:'ok', desc:'deletado'});
}catch(err){
errorHandler(err,req,res);
}
}


exports.carrinhoDeleteItem = async function(req, res){
try{//item:'1'
    const token = await jwt.verificar(req.headers['x-access-token']);
    const carrinho = await Carrinho.findOne({id_usuario:token.sub});
    if(!carrinho){
        return res.status(404).json({status:'err', desc:'nao encontrado'});
    }
    const itens = carrinho.itens.split(';');
    for(let i=0;i<itens.length-1;i++){
        if(req.body.item == itens[i]){
            const index = itens.indexOf(itens[i]);
            itens.splice(index, 1);
        }
    }

    let novosItens = '';
    for(let i=0;i<itens.length-1;i++){
        const item = itens[i] + ';';
        novosItens += item;
    }

    await Carrinho.updateOne({id_usuario:token.sub},{itens:novosItens});
    return res.status(200).json({status:'ok', desc:'deletado'});
}catch(err){
errorHandler(err,req,res);
}
}



exports.finalizarCompra = async function(req, res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    const carrinho = await Carrinho.findOne({id_usuario:token.sub});
    if(!carrinho){
        return res.status(404).json({status:'err', desc:'nao encontrado'});
    }

    const itens = carrinho.itens.split(';');
    const itensAdquiridos = await sql.query(`select id_curso from adquire_curso where id_usuario = $1`,[token.sub]);

    for(let i=0;i<itensAdquiridos.rows.length;i++){
        for(let e=0;e<itens.length;e++){
            if(itensAdquiridos.rows[i].id_curso == itens[e]){
                const index = itens.indexOf(itens[e]);
                itens.splice(index, 1);
            }
        }
    }

    for(let i=0;i<itens.length-1;i++){
        await sql.query(`INSERT INTO adquire_curso values($1, $2, $3)`,[token.sub, parseInt(itens[i]), Date.now()]);
    }
    await Carrinho.updateOne({id_usuario:token.sub},{itens:''});
    res.status(201).json({status:'ok', desc:'adquirido'});

}catch(err){
    errorHandler(err,req,res);
}
}


/* exports.carrinhoLer = async function(req, res){
    try{
        const token = await jwt.verificar(req.headers['x-access-token']);
        const carrinho = await Carrinho.findOne({id_usuario:token.sub});
        if(!carrinho){
            return res.status(404).json({status:'err', desc:'nao encontrado'});
        }
        return res.status(200).json(carrinho.itens);
    
    }catch(err){
        errorHandler(err,req,res);
    }
    }
 */

/* 
exports. = async function(req, res){
try{

}catch(err){
    errorHandler(err,req,res);
}
}
 */