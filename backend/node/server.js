const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes.js');
const cursoRoutes = require('./routes/cursoRoutes.js');
const exercicioRoutes = require('./routes/exercicioRoutes.js');
const atendimentoRoutes = require('./routes/atendimentoRoutes.js');



mongoose.connect('mongodb://localhost:27017/near');
const db = mongoose.connection;
db.on('error',(e)=>{throw new Error('MONGODB_ERR')});
db.once('open',()=>{})


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',(req,res,next)=>{console.log(req.socket.remoteAddress);next()},userRoutes);
app.use('/curso',(req,res,next)=>{console.log(req.socket.remoteAddress);next()},cursoRoutes);
app.use('/exercicio',(req,res,next)=>{console.log(req.socket.remoteAddress);next()},exercicioRoutes);
app.use('/atendimento',(req,res,next)=>{console.log(req.socket.remoteAddress);next()},atendimentoRoutes);

//app.post('/curso/criar')
//router.post('/criar',cursoController.criar,cursoController.upload.single('foto'));
app.listen(8000,()=>{
    console.log('server:ok, porta:8000');
    //const sql = require('./connection.js');
    //sql.query('SELECT * FROM test_connection;');
});