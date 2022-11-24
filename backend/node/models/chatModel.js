const mongoose = require('mongoose');
//esquema
const chat = new mongoose.Schema({
    id_chat: {type:Number,required:true,unique:true},
    id_usuario: {type:Number,required:true,unique:true},
    nome_usuario: {type:String,required:true},
    usuario_leu: {type:Boolean},
    adm_leu: {type:Boolean}
});

module.exports = mongoose.model('Chat', chat);