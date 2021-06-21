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
    return jwt.sign({id},'net ninja secret',{
        expiresIn: maxAge
    });
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

                 let html = `<a href='localhost/user/verify/${key}' style='
            background-color:#000;
            color:#fff;
            border-radius:5px;
            '>Please verify your Account</a>`;
            
            let mail = {
            "receiver":email,
            "subject":"Verify User Account",
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





//exports

module.exports={
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get

}