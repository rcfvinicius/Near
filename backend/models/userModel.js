const mongoose = require('mongoose');
//esquema
const user = new mongoose.Schema({
    nome: {type:String,required:true},
    sobrenome:{type:String},
    email:{type:String,required:true,unique:true},
    senha:{type:String,required:true},
    role:{type:String,default:'aluno'},
    cursos:{type:String,default:''},//com id do curso
    cursosAdquiridos:{type:String,default:''}
});

module.exports = mongoose.model('User', user);