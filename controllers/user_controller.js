const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const utils = require('../util/utils'); 
const bcrypt = require('bcrypt');
const exempt = "-_id -__v -password -key";
//handle errors
const handleErrors=(err)=>{
    console.log(err.message,err.code);

    let errors ={
        email:'',
        password:'',
        username:'',
        account:'',
        status:''

    }

    //duplicate error code
    if(err.code === 11000)
    {
        errors.email="Email already used"

        return errors;
    }

    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'That email is incorrect';
    }


    //incorrect password
    if(err.message === 'Password is incorrect'||err.message==='Minimum password length is 6 characters'){
        errors.password = err.message;
    }

    //username
    if(err.message==='username is required'){
        errors.username='Username was not received'
    }

    //inactive
    if(err.message==='Account is not Active'){
        errors.status = err.message;
    }

    //account type
    if(err.message==='Please Select account type'){
        errors.account = 'Choose an account type';
    }

    //validation errors
    if(err.message.includes('user validation failed'))
    {
        Object.values(err.errors).forEach(({properties})=>{
           errors[properties.path]=properties.message;
        });
    }

    return errors;
}

const maxAge = 3*24*60*60;
//JWT
const createToken =(id)=>{
    return jwt.sign({id},utils.service.secret,{
        expiresIn: maxAge
    });
}

//decode JWT


//signup page


//new User
const signup_post = async (req,res)=>{
    if(req.cookies.jwt){
        res.redirect('/');
    }
    const {email,password,username,account} = req.body;
    try{
        
        const user = await User.create({email,password,username,account});
        
        if(user){
            const key = createToken(user._id);
            User.findByIdAndUpdate({_id:user._id},{key})
            .then(()=>{

                 let html = `<a href='${utils.service.host}user/verify/${key}' style='
            background-color:#000;
            color:#fff;
            border-radius:2px;
            '>Please verify your Account</a>
            
            `;
            
            let mail = {
            "receiver":email,
            "subject":"Verify User Account",
            "text":"Account Verification",
            "html":html
        }

        
        if(utils.mailer(mail)){
            res.status(201).json({user:'User Created'});
        }
        else{
             res.status(300).json({user:'User Creation Attempted but email verification was not sent'});
        }

       

            }).catch((err)=>{
                res.status(400).send('Key was not succesfully created');

            });
           
        }
        

        // const token = createToken(user._id);
      

        // res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});

        // res.status(201).json({user:user._id});
    }
    catch(err){
    
       const errors= handleErrors(err);
        res.status(400).json({errors:errors});
        // throw err;
    }
}

//Signin user
const login_post = async (req,res)=>{//login controller
    const {email,password} =req.body;
    try {
        
        const user = await User.login(email,password);
        const token = createToken(user._id);

        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        
        res.status(200).json({user:user._id});
    } 
    catch (err) {
        const errors = handleErrors(err);
        
        res.status(400).json({errors:errors});
        // throw err;
    }
}

const logout_get = async (req,res)=>{//logout 
    res.cookie('jwt','',{maxAge:1,httpOnly:true});
    res.redirect('/');
}

const  login_signup = async (req,res)=>{//Login and signup page
    if(req.cookies.jwt){
        res.redirect('/');
    }
    res.render('login_signup');
}

const verify_acct= async (req,res)=>{//Verify Account
  
let JWT_back = await utils.decode_JWT(req.params.id);

if(JWT_back){
    let user = await User.findOne({_id:JWT_back._id});

    if(user){
        User.findByIdAndUpdate({_id:JWT_back._id},{active:true})
        
        .then(()=>{
        User.findByIdAndUpdate({_id:JWT_back._id},{active:true,key:null})
        res.send('User successfully Activated');
    }).catch((err)=>{
        res.send('User was not activated');
        throw err;
    });
    }
    else{
        res.send('User Not found');
    }
    
}

}
const profile=async(req,res)=>{
try{
    res.render('profile');
}
catch(error){
res.redirect('/');
}
}


const getProfile = async (req,res)=>{
    try{
        let {user} = req.body;//get user id from link
        console.log(user);
        if(user=='me'){//myself or not 
            user = (await utils.decode_JWT(req.cookies.jwt))._id;//get current user
            if(!user){
                res.status(403).send('user invalid');
            } 

        }
        console.log(user);
        //get user details
        const userBck = await User.find({_id:user},exempt);
      
        res.json({user:userBck,myself:user==(await utils.decode_JWT(req.cookies.jwt))._id});
    }
    catch(error){
    console.log(error);
    }
}

const updateProfile = async(req,res)=>{//updating user profile
    try{
        if(!req.cookies.jwt){//if user is logged in
            throw 'No user';
        }
        const user = (await utils.decode_JWT(req.cookies.jwt))._id;
        let uploadValues={};
        const body = req.body;//get body from request
        const file = req.file;//get file details from request after being handled by multer


        if(file){
            let newDP = await utils.updateUserDP(file,user);
            uploadValues.dp=newDP.cover;
        }
        if(body){
            if(body.username){//if username is sent to updat
                uploadValues.username=body.username;
            }
            if(body.bio){
                 uploadValues.bio=body.bio;
            }

           
        }

        const updateRes=await User.findByIdAndUpdate({_id:user},uploadValues);
        
        if(!updateRes){
            throw 'Could not update Profile';
        }

        res.redirect('/user/profile/me');
    }
    catch(error){
        res.status(403).send(error);
    }
}

const NewPassword =async(req,res)=>{
    try{
        if(!req.cookies.jwt){//if user is logged in
            throw 'No user';
        }
        const user = (await utils.decode_JWT(req.cookies.jwt))._id;
        // const user ='12334567';

        let password = req.body.password;
        if(password){
            const salt = await bcrypt.genSalt();//gen salt
            password = await bcrypt.hash(password,salt);

            let passRes = await User.findByIdAndUpdate({_id:user},{password});

            res.status(200).json({done:true});


        }
        else{
            throw 'No password found'
        }
    }
    catch(error){
        console.log(error);
        res.status(403).json({done:false});
    }
}




//exports

module.exports={
    signup_post,
    login_post,
    logout_get,
    login_signup,
    verify_acct,
    profile,
    getProfile,
    updateProfile,
    NewPassword
}