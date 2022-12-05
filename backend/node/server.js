const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes.js');
const cursoRoutes = require('./routes/cursoRoutes.js');
const exercicioRoutes = require('./routes/exercicioRoutes.js');
const atendimentoRoutes = require('./routes/atendimentoRoutes.js');


//mongoose.connect('mongodb://localhost:27017/near');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',(req,res,next)=>{console.log(req.socket.remoteAddress);next()},userRoutes);
app.use('/curso',(req,res,next)=>{console.log(req.socket.remoteAddress);next()},cursoRoutes);
app.use('/exercicio',(req,res,next)=>{console.log(req.socket.remoteAddress);next()},exercicioRoutes);
app.use('/atendimento',(req,res,next)=>{console.log(req.socket.remoteAddress);next()},atendimentoRoutes);


console.log('Iniciando banco de dados...');
mongoose.connect('mongodb+srv://root:0000@cluster0.padywxe.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log('Atlas Conectado');
    app.listen(8000,()=>{
        console.log('server:ok');
    });
})
.catch(()=>{throw new Error('MONGODB_ATLAS_ERR')});

const db = mongoose.connection;
db.on('error',()=>{throw new Error('MONGODB_ERR')});

