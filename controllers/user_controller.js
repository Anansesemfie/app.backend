const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const utils = require('../util/utils'); 

//handle errors
const handleErrors=(err)=>{
    console.log(err.message,err.code);

    let errors ={
        email:'',
        password:'',
        username:'',
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
    if(err.message === 'Password is incorrect'){
        errors.password = 'This Password is not correct';
    }

    //inactive
    if(err.message==='Account is not Active'){
        errors.status = 'User is not active ';
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
const decode_JWT= (code)=>{

    const token = code;
    //check token
    if(token){
        let back = {_id:""};

        try{
            jwt.verify(token,utils.service.secret,(err,decodedToken)=>{
            if(err){
                throw err;
            }
            else{
               
                back._id=decodedToken.id;
            }
            });

            return back;
        }
        catch(err){
            throw err;
        }

        }
        
        
   
}

//signup page
var signup_get = (req,res)=>{
    res.render('signup');
}
//login page
var login_get = (req,res)=>{
    res.render('login');
}

//new User
var signup_post = async (req,res)=>{
    const {email,password,username} = req.body;
    try{
        
        const user = await User.create({email,password,username});
        
        if(user){
            const key = createToken(user._id);
            User.findByIdAndUpdate({_id:user._id},{key})
            .then(()=>{

                 let html = `<a href='http://127.0.0.1:4000/user/verify/${key}' style='
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

        utils.mailer(mail);

        res.status(201).json({user:user._id});

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
        throw err;
    }
}

//Signin user
var login_post = async (req,res)=>{
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

var logout_get = async (req,res)=>{
    res.cookie('jwt','',{maxAge:1,httpOnly:true});
    res.redirect('/');
}

var verify_acct= async (req,res)=>{
  
let JWT_back = await decode_JWT(req.params.id);

if(JWT_back){
    let user = await User.findOne({_id:JWT_back._id});

    if(user){
        User.findByIdAndUpdate({_id:JWT_back._id},{active:true})
        
        .then(()=>{
        User.findByIdAndUpdate({_id:JWT_back._id},{active:true})
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





//exports

module.exports={
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get,
    verify_acct

}