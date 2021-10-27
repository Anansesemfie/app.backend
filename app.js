//Requires
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {checkUser,checkAccount,requireAuth} = require('./middleware/authMiddleware');

const utils = require('./util/utils');

//routes
const user = require('./routes/user');
const book = require('./routes/book');
const category = require('./routes/category');
const files = require('./routes/files');
const chapter = require('./routes/chapter');
const reaction = require('./routes/reaction');
const filter = require('./routes/filter');
const subscription = require('./routes/subscribe');


// imports 


//start express
const app = express();


//sets
app.set('view engine','ejs');

//uses
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.json());
app.use(cookieParser());

console.log(utils.service.DB);

mongoose.Promise=global.Promise;
//establish connection
mongoose.connect(utils.service.DB,{ useFindAndModify: false,useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex: true,useFindAndModify: true });



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

app.get('*',checkUser);
// app.post('/book',checkAccount);
// app.post('/user',)
// app.get('/',requireAuth,(req,res)=>{res.render('index');});
app.use('/user',checkUser,user);
app.use('/book',book);

app.use('/category',category);
app.use('/file',files);
app.use('/chapter',chapter);
app.use('/filter',filter);

app.use('/react',reaction);
app.use('/subscribe',subscription);
// app.post('/react',requireAuth);



app.get('/',(req,res)=>{
    res.render('index');
})

// app.post('/',(req,res)=>{
//     console.log(req.files);
//     if(req.files){
//         console.log(req.files.cover);
//         res.send(req.files.cover);
//     }
// })

app.use('',(req,res)=>{
res.render("notFound");
});









