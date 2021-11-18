const {subscription,subscribing} = require('../models/subscriptionModel');
const {paywithPAYSTACK}= require('../util/payments');

const exempt =' -v';

//aux functions

// const dateDiff = async(time)=>{
//     try{
//         if

//     }
//     catch(error){

//     }
// }



//automated functions

const autoCheckSubscriptions = async ()=>{
    try{

        //get all active subscriptions
        const allSubscribed = await subscribing.find({active:true},exempt);
        if(!allSubscribed){
            throw 'No subscriptions found';
        }

        //check each subsscription
        allSubscribed.forEach(async (sub)=>{
            let subDetails = await subscription.subDetails(sub.subscription);//get subscription type details
            if(!subDetails){//check details
                throw 'Details not found';
            }
            

        })



    }
    catch(error){

    }
}






//route controllers 
const getPage = async(req,res)=>{
    try{
        res.render('subscribe');
    }
    catch(error){
        res.status(403).json({error});
    }
}

//get all active subscriptions
const getSubscriptions = async(req,res)=>{
    try{
        if(!req.body){
            throw 'no body'
        }
        const reqBody={};

        if(req.body.active){//if there was an active 

            switch (req.body.active) {//check param

                case "all"://all subscriptions
                    delete reqBody.active;
                    break;

                case "true"://just active subscription type

                        reqBody.active=true;
                break;

                case "false"://just inactive subscription type
                        reqBody.active=false;
                break;
            
                default:
                    throw 'Keyword not recognized';
                break;
            }
            
            
        }
        else{
            reqBody.active=true;
        }
        

        console.log(reqBody);

        const subs= await subscription.find(reqBody,exempt);
        if(!subs){
            throw 'Something unsual happened';
        }
        // continue after fetch for subs
        // console.log(subs);

        res.json({subs});


    }
    catch(error){
        res.status(403).json({error});
    }
}

//create a subscription
const postSubscription =async(req,res)=>{
    try{
        if(!req.body){
            throw 'Body is empty';
        }
        const body = req.body;
       
        const oneMnt = 2.628e+9
        const times = body.duration;
        const duration = oneMnt*times;

        const newSubscription = {
            name:body.name,
            amount:body.amount,
            accent:body.accent,
            users:body.users,
            autorenew:body.auto,
            active:body.active,
            duration
        }

        const createSubscription = await subscription.create(newSubscription);
        if(!createSubscription){
            throw 'Something happened while attempting add new subscription';
        }

        res.json({createSubscription});//return msg
    }
    catch(error){
        console.log(error);
        res.status(403).json({error});
    }
}



const Subscribe = async (req,res)=>{
    try{
       
        // if(!req.cookies.jwt){
        //     res.redirect('/user/redirect?=subscribe');
        // }
        const subName = req.query.subscriptionsKey;
        if(!subName){
            throw 'No Subscription key was found';
        }

        // something was passed;
        const thisSub = await subscription.findOne({name:subName});
        if(!thisSub){
            throw 'Something else happened';
        }

        // console.log(thisSub);
        //subscription was found
        const Amnt = (thisSub.amount)*100;
       
        let realAmnt="";
        if(Amnt==0){
            realAmnt="0";
        }
        if(Amnt<0){
            throw 'This is not expected'
        }
        if(Amnt>0){
            realAmnt = Amnt.toString();
        }
        //  console.log(realAmnt);


        const sending = {
            amount:realAmnt,
            email:'akwasi.osei.adubofour@gmail.com',
            reference:'Testing_Bro'

        }

        const payBack = await paywithPAYSTACK(sending);
        // console.log(payBack);
        // if(!payBack){
        //     throw 'Error connecting to payStack';
        // }

        // res.json({payBack});



    }
    catch(error){
        console.log(error);
        // res.status(403).json({error});
    }

}

module.exports={
getPage,
getSubscriptions,
postSubscription,
Subscribe

}