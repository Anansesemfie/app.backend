//Requires
const express = require('express');
const https = require('https');
const date = new Date();

const {checkSubs}= require('./util/Extras');
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }
require('dotenv').config();




// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {checkUser,checkAccount,requireAuth} = require('./middleware/authMiddleware');

const utils = require('./util/utils');

console.log(utils.service);
//routes
const user = require('./routes/user');
const book = require('./routes/book');
const category = require('./routes/category');
const files = require('./routes/files');
const chapter = require('./routes/chapter');
const reaction = require('./routes/reaction');
const filter = require('./routes/filter');
const subscription = require('./routes/subscribe');
const languages = require('./routes/lang');


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

// console.log(utils.service.DB);

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





setInterval(() => {
    let now = date.getHours();//get current time
    let convTime = now*100 + date.getMinutes();
        
    if(convTime == 2459){//check if time is 12:59pm
        
         app.emit('subscriptions');
    }

   
},60000)


//start local server
app.on('ready',()=>{
    app.listen(utils.service.port,()=>{
      console.log(process.env.SECRET);
        console.log(`Connection established on port ${utils.service.port} `);
        console.log(process.env.HOST);
    })
}).on('error',()=>{
    console.log("Error whiles connecting to DB");
});


//events
app.on('subscriptions',()=>{
    checkSubs();
})


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
app.use('/langs',languages);
// app.post('/react',requireAuth);



app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/congrats',(req,res)=>{
  res.render('congrats');
})
// app.get('/sub',(req,res)=>{
    
// const params = JSON.stringify({
//   "email": "customer@email.com",
//   "amount": "20000"
// })
// const options = {
//   hostname: 'api.paystack.co',
//   port: 443,
//   path: '/transaction/initialize',
//   method: 'POST',
//   headers: {
//     Authorization: 'Bearer sk_test_d21da8e4ea8643a9a20ef0df44d782ff71fc5600',
//     'Content-Type': 'application/json'
//   }
// }
// const request = https.request(options, res => {
//   let data = ''
//   res.on('data', (chunk) => {
//     data += chunk
//   });
//   res.on('end', () => {
//     console.log(JSON.parse(data))
    
//   })
// }).on('error', error => {
//   console.error(error)
// })
// request.write(params)
// request.end()
// })
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




