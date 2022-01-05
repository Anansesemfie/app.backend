const {subscribing,subscription}= require('../models/subscriptionModel');
const {bookReact,bookSeen}= require('../models/reactionModel');
const User = require('../models/userModel');
const {Daydif,milliToggle,mailTemplate,calculateMoney} = require('./utils');


// private 
const calcMoney = async (book,start='')=>{
    /*
    1.receive book
    2.No start date
        1. use book date 
    2.get dislikes and played via start and end of month
    3.calculate Money 
    4.return bookName dislikes played and final amount
    */ 

    try{
        // console.log(typeof book.moment);
        let end;

        if(!start){//if any missing dates
            // console.log('nonstart')
            bookDate = book.moment.toString();
            // console.log(bookDate);
            let startDate=new Date(bookDate.slice(0,15));
           start = daysInMonth(startDate.getMonth(),startDate.getFullYear()).full;
           console.log(start);
           end= daysInMonth().full;
        }
        else{
            let details = start.split('-');
            console.log(details);
            let newDate =daysInMonth(details[1],details[0]);
            console.log(newDate);

            end= newDate.full;
        }
            console.log('trial:',trialDate);
            
        const Dislikes = await bookReact.countReact({book:book._id,//get dislikes via book id
            start:start,
            end:end,
            type:'Dislike'});

            if(!Dislikes){
                throw 'Error getting dislikes';
            }
            
        const seenPlayed = await bookSeen.countSeen({book:book._id,start,end});
        if(!seenPlayed){
            throw 'error getting played or seen';
        }
        
        //calculate
        let moneyDetails = calculateMoney(seenPlayed.bookPlayed,Dislikes);
        console.log(moneyDetails);
        

        // return {Dislikes,Seen:seenPlayed};

    }
    catch(error){
        console.log(error);
        throw error;
    }
}




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
    
            
            utils.mailer(mail);



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

const compareMaxUsers = async (sub)=>{
    /*
    1. get sub details
    2. get parent sub Details
    3. count number of users on this subscription
    4. if users exceeds max users of parent subscription
    5. set subscription to status Inactive
    6. if users don't exceed max users of parent subscription
    7. check if subscription status is "Active"
    */

    try{    
        if(!sub){
            throw 'error getting subscription details';
        }

        let originSub = await subscription.findOne({_id:sub.subscription,active:true},'-__v -moment -active -accent -name -amount');//parent subscription details

        if(!originSub){
            throw 'error getting subscription details';
        }

        let users = await User.countDocuments({subscription:sub._id});

        if(users>originSub.users){//exceeds max
            let intoOblivion =  await subscribing.updateOne({_id:sub._id},{status:'Inactive'});
            if(!intoOblivion){
                throw 'Error in Deactivation'
            }

        }
        else{//in range
            if(sub.status!='Active'){
              let backToLife =  await subscribing.updateOne({_id:sub._id},{status:'Active'});
              if(!backToLife){
                throw 'Error in Activation'
              }
            }

        }
        


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

        // console.log(sub);
        let originSub = await subscription.findOne({_id:sub.subscription,active:true},'-__v -moment -active -accent -name -amount');//parent subscription details

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
    try{
        let subs = await subscribing.find({active:true},'-__v -ref -user -status');//get all active subscriptions
            if(!subs){
                throw 'error getting subscriptions';
            }
            if(subs.length==0){
                throw 'no active subscriptions found'
            }
            subs.forEach(s => {
                checkThis(s);
                compareMaxUsers(s);
                
            });
    }
    catch(error){
        throw error;

    }
    


 }

 const checkbooks = async ()=>{
     try{
         

     }
     catch(error){
         throw error;
     }
 }


 const checkOwners = async ()=>{//check
    try{
        let owners = await User.find({account:'Owner',active:true});
        if(!owners){//did not get all owners
            throw 'error getting owners';
        }
        owners.forEach(owner => {


        })


    }
    catch(error){
        throw error;
    }
}


 module.exports ={
     checkSubs
 }