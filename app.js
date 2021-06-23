//Requires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const utils = require('./util/utils');

const user = require('./routes/user');

//start express
const app = express();


//sets
app
app.set('view engine','ejs');

//uses
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


//establish connection
mongoose.connect(utils.service.DB,{ useFindAndModify: false,useUnifiedTopology:true,useNewUrlParser:true });

//open connection and start server from here
mongoose.connection.once('open',()=>{
    app.emit('ready');
}).on('error',()=>{
    console.log("Couldn't connect to DB");
    app.emit('error');
})


//start local server
app.on('ready',()=>{
    app.listen(utils.service.port,()=>{
        console.log(`Connection established on port ${utils.service.port} `);
    })
}).on('error',()=>{
    console.log("Error whiles connecting to DB");
});


//routes
app.use('/user',user);
app.get('/',(req,res)=>{
    res.render('index');
})









