const sql = require('../connection.js');
const jwt = require('../utils/jwt.js');
const errorHandler = require('../utils/errorHandler.js');
const Chat = require('../models/chatModel.js');
const Mensagem = require('../models/mensagemModel.js')

exports.enviarMensagem = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    if(token.role == 'admin'){
        const chat = await Chat.findOne({id_chat:req.body.id_chat});
        if(!chat){
            console.log(req.body)
            throw new Error('CHAT_NAO_ENCONTRADO');
        }
        const novaMensagem = new Mensagem({
            id_chat:chat.id_chat,
            id_usuario:token.sub,
            admin:true,
            mensagem: req.body.mensagem,
            data: Date.now()
        });
        await novaMensagem.save();

        res.status(200).json({status:'ok', desc:null, id_chat:chat.id_chat});
        return;
    }

    const chat = await Chat.findOne({id_usuario:token.sub});
    let id_chat_random = null;
    if(!chat){
        id_chat_random = parseInt(Math.random() * 10000000000);
        const novoChat = new Chat({
            id_chat:id_chat_random,
            id_usuario:token.sub,
            nome_usuario: token.nome,
            usuario_leu:false,
            adm_leu:false
        });
        await novoChat.save();
        //return res.status(201).json({status:'ok', desc:'criado'});
    }
    
    const novaMensagem = new Mensagem({
        id_chat:id_chat_random??chat.id_chat,
        id_usuario:token.sub,
        admin:false,
        mensagem: req.body.mensagem,
        data: Date.now()
    });

    await novaMensagem.save();

    res.status(200).json({status:'ok', desc:null, id_chat:id_chat_random??chat.id_chat});

}catch(err){
    errorHandler(err,req,res);
}
}


exports.buscarMensagens = async function(req,res){
try{
    const token = await jwt.verificar(req.headers['x-access-token']);
    let mensagens;
    mensagens = await Mensagem.find({id_chat:parseInt(req.query.id_chat)}).sort({data:-1});
    
    res.json(mensagens)
}catch(err){
    errorHandler(err,req,res);
}
}


exports.buscarChats = async function(req,res){
    try{
        const token = await jwt.verificar(req.headers['x-access-token']);

        if(token.role == 'admin'){
            const chats = await Chat.find();
            res.json(chats);
        }else{
            const chats = await Chat.find({id_usuario:token.sub});
            res.json(chats);
        }

    }catch(err){
        errorHandler(err,req,res);
    }
    }