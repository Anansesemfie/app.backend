const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const{service} = require('../util/utils');

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt

    //check token
    if(token){
        jwt.verify(token,service.secret,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }

  
}

const checkUser = async (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,service.secret,async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                // console.log(decodedToken);

                let user = await User.findById(decodedToken.id);
                if(!user.active){
                    res.redirect('/login');
                }
                res.locals.user = user;
                next();
            }
        })
    }
    else{
        res.locals.user = null;
        next();

    }
}

const checkAccount = async (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,service.secret,async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/');
                next();
            }
            else{
                // console.log(decodedToken);

                let user = await User.findById(decodedToken.id);
                if(user.account!=="Creator"){
                    res.redirect('/');
                }
                // res.locals.user = user._id;
                next();
            }
        })
    }
    else{
        res.redirect('/');
        // res.locals.user = null;
        next();

    }
}



module.exports={
    requireAuth,
    checkUser,
    checkAccount
};