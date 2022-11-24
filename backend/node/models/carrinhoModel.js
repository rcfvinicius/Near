const mongoose = require('mongoose');
//esquema
const carrinho = new mongoose.Schema({
    id_usuario: {type:Number,required:true,unique:true},
    itens:{type:String}
});

module.exports = mongoose.model('Carrinho', carrinho);