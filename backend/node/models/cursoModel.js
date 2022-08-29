const mongoose = require('mongoose');
//esquema
const curso = new mongoose.Schema({
    criador:{type:String,required:true},
    titulo: {type:String,required:true},
    tituloLongo:{type:String},
    descricao:{type:String},
    categoria:{type:String},
    preco:{type:Number,required:true}
});

module.exports = mongoose.model('Curso', curso);