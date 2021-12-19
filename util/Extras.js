const {subscribing,subscription}= require('../models/subscriptionModel');
const User = require('../models/userModel');
const {Daydif,milliToggle,mailTemplate,} = require('./utils');

 /*
1. get subscriptions
2. loop through all subscriptions
3. Get actual subscription details
4. create function to compare time with current time
5. convert duration to days 
6. compare time with duration
7. if yes, deactivate subscription
 */
    const deSubscribe = async (sub)=>{
        try{
            let success = await subscribing.closeSub(sub);
            if(!success){
                throw 'error deactivate subscription';
            }
            let user = await User.info(success.user);//user info
            if(!user){
                throw 'could not find user';
            }

            let thisMail =  mailTemplate({
                label:"Subscription Expired",
                action:"subscribe"
            });

            let mail = {
                "receiver":user.email,
                "subject":"Subscription Expired",
                "text":"Your current subscription has been Deactivated",
                "html":thisMail
            }
    
            
            await utils.mailer(mail);



            return true;

        }
        catch(error){
            throw error;
        }
    }

const compareTimes =async (time,duration)=>{//compare time and duration
    try{
        if(!time||!duration) throw 'Missing arguements';
        // console.log(newTime,time);

        const actDuration = await milliToggle({time:duration,return:'toDays'});
        const actTime = await Daydif(time);

        return actTime>=actDuration;
            
        

    }
    catch(error){
        throw error;

    }
}


const checkThis = async (sub)=>{
    try{
        if(!sub){
            throw 'error getting subscription details';
        }

        console.log(sub);
        const originSub = await subscription.findOne({_id:sub.subscription,active:true},'-__v -moment -active -accent -name -amount');//parent subscription details

        if(!originSub){
            throw 'error getting subscription details';
        }
        let time = await compareTimes(sub.moment,originSub.duration);

       if(time){//deactivate subscription   

        await deSubscribe(sub._id);

            if(originSub.autorenew){

                console.log('attempted autorenewal');
            }
       }

        return originSub;

    }
    catch(error){
        throw error;
    }
}






 const checkSubs = async ()=>{//check subscriptions
    let subs = await subscribing.find({active:true},'-__v -ref -user -status');//get all active subscriptions
    if(!subs){
        throw 'error getting subscriptions';
    }

    subs.forEach(s => {
        (checkThis(s));
        
    });



    // console.log(subs)

 }


 module.exports ={
     checkSubs
 }