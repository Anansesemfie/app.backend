const {subscribing,subscription} = require('../models/subscriptionModel');

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const utils = require('../util/utils'); 
const bcrypt = require('bcrypt');
const exempt = "-_id -__v -password -key";

const maxAge = 3*24*60*60;
//JWT
const createToken =(id)=>{
    return jwt.sign({id},utils.service.secret,{
        expiresIn: maxAge
    });
}

//decode JWT


//signup page


//new User.................................................................................................................
const signup_post = async (req,res)=>{
   
    try{
         if(req.cookies.jwt){
        res.redirect('/');
    }
    let {email,password,username,account} = req.body;
        // let myAccount='';
        if(!account){
            account='Consumer';
        }
        console.log(req.body);
        const user = await User.create({email,password,username,account});
        
        if(!user){
            throw 'Error while creating account'

        }
            const key = createToken(user._id);
            const upUser= await User.updateOne({_id:user._id},{key})


            if(!upUser){
                throw 'Account Setup issues';
            }
            
                 let html = `
                 <div style="background-color:white; width:100%; height:auto;">
                 <img src="${utils.service.host}/images/logo_d.png" style="width:20%;">
                 </div><hr>
                 <a href='${utils.service.host}user/verify/${key}' style='
                 background-image: linear-gradient(
                    90deg, rgb(97, 174, 197), rgb(224, 194, 19));
                color: rgb(255, 255, 255);
                border-radius: 4px;
                padding: 15px 32px;
                text-align: center;
            '>Please verify your Account</a>
            <div style="background-color:black; color:white; margin-top:5%;">
            copyright Anansesemfie
       </div>
            
            `;
            
            let mail = {
            "receiver":email,
            "subject":"Verify User Account",
            "text":"Account Verification",
            "html":html
        }

        
        
        

            
            utils.mailer(mail)
            res.status(200).json({status:'Successful'});
           
    }
    catch(err){
        let errors = err
        if(err.code ===11000){
            errors ="Email is already used"
            
        }
console.log(err);
    //   = handleErrors(err);
        res.status(403).json({error:errors});
        // throw err;
    }
}



//Signin user..............................................................................................................
const login_post = async (req,res)=>{//login controller
   
    try {
         const {email,password,source} =req.body;
          let subscription;
        console.log(source,email,password);
        const thisUser = await User.login(email,password);
        if(!thisUser){
            throw 'Error logging in'
        }
        if(thisUser.subscription){
            subscription= await subscribing.valid(thisUser.subscription)
        }
        else{
            subscription=false
        }
        

        const token = createToken(thisUser._id);
        let user ={
            userID: thisUser._id,
            username: thisUser.username,
            profile_picture:thisUser.dp,
            email: thisUser.email

        }
        if(source=='Web'||source==undefined){
            delete user.userID;
            delete user.profile_picture;
            delete user.email;
            delete user.userID;

            res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        }
        console.log(user);
        
        res.status(200).json({user,subscription});
    } 
    catch (err) {
        // console.log(err);
        // const errors = handleErrors(err);
        
        res.status(403).json({error:err});
        // throw err;
    }
}



const logout_get = async (req,res)=>{ //logout ....................................................................................................
    try{
        let user;
        let source="mobile";
        if(req.cookies.jwt){
            user = (await utils.decode_JWT(req.cookies.jwt))._id;
            source="Web";
        }
        else if(req.query.user){
            user = req.query.user;
        }
        else{
            throw 'User not found';
        }

        //update login status
        const loginUpdate = await User.updateOne({_id:user},{loggedin:false});
        if(!loginUpdate){
            throw "Error updating login status";
        }

        if(source=="Web"){
            res.cookie('jwt','',{maxAge:1,httpOnly:true});
            res.redirect('/');
        }
        else{
            res.status(200).json({status:"Success"});
        }

        

    }
    catch(error){
        res.status(403).json({error})
    }
    
}

const  login_signup = async (req,res)=>{//Login and signup page.............................................................................................
    if(req.cookies.jwt){
        res.redirect('/');
    }
    else{
         res.render('login_signup');
    }
   
}

const verify_acct= async (req,res)=>{//Verify Account.........................................................................................................
  try{
      if(!req.params.id){
           throw 'Token not valid';
      }
      let JWT_back = await utils.decode_JWT(req.params.id);
      if(!JWT_back){
       throw 'Trouble decoding token'
      }

        let user = await User.findOne({_id:JWT_back._id});//locate user data
        if(!user){
            throw 'user not found';
        }
        // console.log(user);

        const upOne= await User.updateOne({_id:JWT_back._id},{active:true})//activate account
        if(!upOne){
            throw 'Error verifying account';
        }
        const upTwo = await User.updateOne({_id:JWT_back._id},{active:true,key:null})
            if(!upTwo){
                 throw 'Error verifying account';
            }
            // console.log(upTwo);

            //open onetime subscription
            const sub = await subscription.details('Welcome');
            // console.log(sub);
            if(!sub){
                throw 'Subscription Failed';
            }

            //open new subscription instance
            const randomRef = utils.genRandCode()//generate random code

            const newSub = await subscribing.openSubscribe(
                {
                    subscription:sub.id,
                    user:user._id,
                    ref:randomRef

                },subscription
            );

            if(!newSub){
                throw 'Error while activating trial package';
            }
            console.log(newSub);

            const initSub = User.subscription({user:user._id,subscription:newSub},subscription,subscribing);
            if(!initSub){
                throw 'Failed to initialize subscription';
            }

        res.render('congrats',{username:user.username,message:'User was successfully activated'});//render varification page
        

  }
  catch(error){
      console.log(error);
    res.render('instruction',{error});
  }

}

const profile=async(req,res)=>{//profile...........................................................................................................................
try{
    res.render('profile');
}
catch(error){
res.redirect('/');
}
}


const getProfile = async (req,res)=>{//profile details...........................................................................................................
    try{
        let {user} = req.body;//get user id from link
        let myself = false;
        let subscription;
        // console.log(user);
        if(user=='me'){//myself or not 
            user = (await utils.decode_JWT(req.cookies.jwt))._id;//get current user
            if(!user){
               throw 'user invalid';
            }  

        }
        if(req.cookies.jwt){
            if(user==(await utils.decode_JWT(req.cookies.jwt))._id){
            myself=true;
        }
        }
        
    
        //get user details
        const userBck = await User.findOne({_id:user},exempt);

        console.log(userBck);
        if(userBck.subscription){
            subscription= await subscribing.valid(userBck.subscription)
        }
        else{
            subscription=false
        }
      
        res.json({user:userBck,myself,subscription});
    }
    catch(error){
    // console.log(error);
    res.status(403).json({error})
    }
}

const updateProfile = async(req,res)=>{//updating user profile...............................................................................................................
    try{
        // console.log(req.body)
        let user;
        let source="Mobile";
        if(req.cookies.jwt){//if user is logged in
            user = (await utils.decode_JWT(req.cookies.jwt))._id;
            source="Web";
        }
        else if(req.body.userID){
            user=req.body.userID
        }
        else{
            throw 'No user';
        }
     
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

        const updateRes=await User.updateOne({_id:user},uploadValues);
        
        if(!updateRes){
            throw 'Could not update Profile';
        }
        if(source=="Web"){
            res.redirect('/user/profile/me');
        }
        else{
            res.status(200).json({state:"Success"});
        }
        
    }
    catch(error){
        res.status(403).json({error});
    }
}

const NewPassword =async(req,res)=>{//update password.......................................................................................................................
    try{
        let {password,userID} = req.body;
         let user ;
        if(req.cookies.jwt){//if user is logged in
            user = (await utils.decode_JWT(req.cookies.jwt))._id;
        }
        else if(userID){
            user = userID
        }
            else{
            throw 'No user';
        }
      
        // const user ='12334567';

        
        if(password){
            const salt = await bcrypt.genSalt();//gen salt
            password = await bcrypt.hash(password,salt);

            const passRes = await User.updateOne({_id:user},{password});

            if(!passRes){
                throw 'Error updating password'
            }

            res.status(200).json({done:true});


        }
        else{
            throw 'No password found'
        }
    }
    catch(error){
        console.log(error);
        res.status(403).json({error});
    }
}

const resetPassword = async(req,res)=>{//reset password.........................................................................................................
    try{
        if(req.cookies.jwt){//if user already logged in
            throw 'This is not allowed'
        }
        const {email}=req.body;//get email from request

        const user_name = await User.findOne({email});//look for email
        if(!user_name){//user not found
            throw 'email not found';
        }

        const newPass = utils.genRandCode()//generate new password
        // console.log(utils.service.host);
        const salt = await bcrypt.genSalt();//gen salt
        let password = await bcrypt.hash(newPass,salt);

        console.log(password);
        let passRes = await User.findByIdAndUpdate({_id:user_name._id},{password},{useFindAndModify:false});

        if(!passRes){
            throw `Couldn't reset password`;
        }
            //successfully set new password

            let html = `
            <div style="background-color:white; width:100%; height:auto;">
            <img src="${utils.service.host}/images/logo_d.png" style="width:20%;">
            </div><hr>
            <label>New Password</label>
            <p><h3>${newPass}</h3></p>
            <a href='${utils.service.host}user/' style='
            background-image: linear-gradient(
                90deg, rgb(97, 174, 197), rgb(224, 194, 19));
            color: rgb(255, 255, 255);
            border-radius: 4px;
            padding: 15px 32px;
            text-align: center;
       '>Login</a>
       <div style="background-color:black; color:white; margin-top:5%;">
            copyright Anansesemfie
       </div>
       
       `;
       
       let mail = {
       "receiver":email,
       "subject":"Reset Account",
       "text":"Account Reset",
       "html":html
    }

   
    await utils.mailer(mail);
       res.status(201).json({user:`Account reseted successfully, check email ${email}`});
    
            



        // res.json({newPass})

    }
    catch(error){
        res.status(403).json({error});
    }
}

const reVerifyEmail = async(req,res)=>{//resend verification mail ...........................................................
    try{
        if(req.cookies.jwt){//if user already logged in
            throw 'This is not allowed'
        }
        const {email}=req.body;//get email from request

        const user_name = await User.findOne({email});//look for email
        if(!user_name){//user not found
            throw 'email not found';
        }
        if(user_name.active){
            throw "Email Already verified";
        }

        const key = createToken(user_name._id);
            const upUser= await User.updateOne({_id:user_name._id},{key})


            if(!upUser){
                throw 'Account Setup issues';
            }
            
                 let html = `
                 <div style="background-color:white; width:100%; height:auto;">
                 <img src="${utils.service.host}/images/logo_d.png" style="width:20%;">
                 </div><hr>
                 <a href='${utils.service.host}user/verify/${key}' style='
                 background-image: linear-gradient(
                    90deg, rgb(97, 174, 197), rgb(224, 194, 19));
                color: rgb(255, 255, 255);
                border-radius: 4px;
                padding: 15px 32px;
                text-align: center;
            '>Please verify your Account</a>
            <div style="background-color:black; color:white; margin-top:5%;">
            copyright Anansesemfie
       </div>
            
            `;
            
            let mail = {
            "receiver":email,
            "subject":"Verify User Account",
            "text":"Account Verification",
            "html":html
        }

        
        
        

            
            utils.mailer(mail)
            res.status(200).json({status:'Successful'});
           

    }
    catch(error){
        res.status(403).json({error});
    }

}


const getOwners = async (req,res)=>{//get all account type owners..............................................
    try{
       
        
        if(!req.body){//if body is present
            throw 'Body missing'
        }

         const {accountType,status} = req.body;
         let Owners;

        if(accountType!=undefined&&status!=undefined){
            //there is a body
            console.log('yes body');
          
            console.log(req.body);
            Owners= await User.users({
                accountType,
                status
            });

            if(!Owners){
                throw 'Error getting specified owners';
            }
        }
        else{
            //no body present
            console.log('nobody');
            Owners= await User.users({
                accountType:'Owner',
                status:'Active'
            });
            if(!Owners){
                throw 'Error getting owners';
            }
        }

        // console.log(owners)

        res.json({Owners})

        
    }
    catch(error){
        // console.log(error);
        res.status(403).json({error});
    }
}

const updateBank = async (req, res) => {
    try{
        if(!req.cookies.jwt){
            throw 'Missing User'
        }
        const user = (await utils.decode_JWT(req.cookies.jwt))._id;
        const {accountName,accountNumber,accountBranch,bankName}=req.body;

        const updateAccount = await User.updateOne({_id:user},{bank:{
            bank:bankName,
            name:accountName,
            number:accountNumber,
            branch:accountBranch
        }});

        if(!updateAccount){
            throw 'Error empty update account';
        }
        res.json({state:'Successful'});
    }
    catch(error){
        console.log(error);
        res.status(403).json({error});

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
    NewPassword,
    resetPassword,
    getOwners,
    updateBank,
    reVerifyEmail
}