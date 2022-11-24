const mongoose = require('mongoose');
//esquema
const mensagem = new mongoose.Schema({
    id_chat: {type:Number,required:true},
    id_usuario: {type:Number,required:true},
    admin: {type:Boolean,required:true, default:false},
    mensagem: {type:String},
    data: {type:Number}
});

module.exports = mongoose.model('Mensagem', mensagem);