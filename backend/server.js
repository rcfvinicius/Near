const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const cursoRoutes = require('./routes/cursoRoutes.js');

mongoose.connect('mongodb://localhost:27017/near');
const db = mongoose.connection;
db.on('error',(e)=>{throw new Error('DB_ERR')});

db.once('open',()=>{
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    app.use('/user',userRoutes);
    app.use('/curso',cursoRoutes)

    app.listen(8000,()=>{console.log('server:ok')});
})