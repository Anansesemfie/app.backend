const { ObjectId } = require('bson');
const mongoose = require('mongoose');
// const { findById, findOne } = require('./userModel');

const Schema = mongoose.Schema

const subscriptionSchema = new Schema({//list of subscription types
    name:{
        type:String,
        unique:true,
        required:[true,'Subscription needs a unique name']
    },
    active:{
        type:Boolean,
        default:false
    },
    duration:{
        type:String,
        default:'2592000000'
    },
    users:{
        type:Number,
        min:1,
        required:false,
        default:1
    },
    autorenew:{
        type:Boolean,
        default:false
    },
    amount:{
        type:Number,
        min:0,
        required:[true,'Subscription amount is missing']
    },
    accent:{
        type:String,
        default:'chocolate'
    },
    moment:{
        type:Date,
        default:mongoose.now()
    }

},{
     timestamp:true
 });


 const subscribedSchema = new Schema({//active and inactive subscriptions
    subscription:{
        type:ObjectId,
        required:[true,'missing subscription key']
    },
    user:{
        type:ObjectId,
        required:[true,'missing user ID']
    },
    maxUsers:{
        type:Number,
        required:[true,'Missing max # of users']
    },
    status:{
        type:String,
        default:'Active'
    },
    active:{
        type:Boolean,
        default:true
    },
    ref:{
        type:String,
        required:[true,'Reference ID is required'],
        unique:[true,'Reference ID exist already']
    },
    moment:{
        type:Date,
        default:mongoose.now()
    }

},{
     timestamp:true
 })
 
 //statics for subscription types
 subscriptionSchema.statics.details = async function(subID){
     try{
        //get id first
        if(!subID){
            throw 'ID not found';
        }
        //search for details
        const details = await this.findOne({name:subID});
        if(!details){
            throw 'Could not fetch subscription type details';
        }
        return {
            id:details._id,
            duration:details.duration,
            renew:details.autorenew,
            status:details.active,
            users:details.users,
            amount:details.amount
        }
     }
     catch(error){
        throw error;
     }
 }

 //some static functions for subscriptions

 subscribedSchema.statics.openSubscribe = async function (details,subs){//new subscription
     try{
        // const chkRef = await this.find({ref:details.ref});
        // if(chkRef){//reference already exists
        //     throw 'Reference already exists';
        // }
        //continue after ref check....................................
        //VARS
        const subscription_ID = details.subscription;
        const chkSubs = await subs.findOne({_id:subscription_ID});

        if(!chkSubs){
            throw 'This subscription does not exist';
        }
        //continue after checking subscription availability

        //data from schema
        const maxUsers = chkSubs.users;
        const subscription = chkSubs._id;

        //data from req
        const user = details.user;
        const ref = details.ref;

        const addSub = await this.create({maxUsers,subscription,user,ref});

        if(!addSub){
            throw 'Error adding Subscription';
        }
       
        return addSub._id;

     }
     catch(error){
        throw error;
     }

 }

 subscribedSchema.statics.toggleSubscribe = async function(details){//deactivate and active subscription
     try{
        const user = details.user;
        const sub = details.subscription;

        if(!user&&!sub){//check presence of user id and subscription id
            throw 'User or subscription invalid';
        }
        //continue after detail check
        const chkSubs = await this.findOne({user,_id:sub,status:'Active'});//look for subscription

        if(!chkSubs){
            throw 'Subscription was not found';
        }
        //continue after looking for subscription

        if(chkSubs.status==='Active'){//deactivate
            
            let closeSub = await this.updateOne({_id:chkSubs._id},{status:'Inactive'});

        }
        else{
            let openSub = await this.updateOne({_id:chkSubs._id},{status:'Active'});
        }

     }
     catch(error){
        throw error;
     }
 }

 //Cancel or close subscription will be here
 subscribedSchema.statics.closeSub = async function(details){
     try{
        //details
        const sub = details;

        console.log(sub);
       

        if(!sub){
            throw 'missing details';
        }
        // continue after detail check
        const chksub = await this.findOne({_id:sub,active:true});
        
        if(!chksub){//check if subscription exist's
            throw 'subscription not found';
        } 

        const termSub = await this.updateOne({_id:chksub._id},{active:false});
        if(!termSub){
            throw 'could not close subscription';
        }
        return {
            subscription_type:termSub.subscription,
            user_id:termSub.user
        }
     }
     catch(error){
        throw error;
     }
 }

 subscribedSchema.statics.getSubs = async ()=>{
     try{
        let sub = await this.find({active:true},'-__v -ref -user -_id -status');

        return sub;
     }
     catch(error){
         throw error;
     }
 }

 subscribedSchema.statics.valid = async function(id=''){
     try{   
         const feedBack={
             active:'',info:""
         };
        //  console.log(id);
        if(!id){
            feedBack.active =false;
            feedBack.info ='subscription not found';
        }
        else{

            let sub = await this.findOne({_id:id});//locate subscription
            // console.log(sub);
            if(!sub){
                throw 'Error locating subscription';
            }
            // if()
            

            switch (sub.active) {
                case true:
                    console.log('true');
                    //active subscription
                    switch (sub.status) {
                        case 'Active':
                            feedBack.active =true;
                            feedBack.info ='Active subscription';
                            break;
                        case 'Inactive':
                            feedBack.active =false;
                            feedBack.info ='This is a faulty subscription';

                        break;
                        default:
                            feedBack.active =false;
                            feedBack.info ='There is something wrong with this subscription';
                            break;
                    }
                    
                    break;
            
                default:
                    console.log('false');
                    feedBack.active=false;
                    feedBack.info ='Subscription Expired'
                    break;
            }

        }
            

            return feedBack;        

     }
     catch(error){
         throw error;

     }
 } 

//collections 
 const subscription = mongoose.model('subscription',subscriptionSchema);
 const subscribing = mongoose.model('subscribed',subscribedSchema);



 


 module.exports={
     subscription,
     subscribing
 };
