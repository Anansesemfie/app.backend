const lang = require('../models/langsModel');
const exempt = '-__v -status -active -_id -createdAt -updatedAt';

const getLangs = async (req,res)=>{
    try{
        const languages = await lang.find({active:true},exempt);
        if(languages){
            
            res.json({languages});
        }
        else{
            res.json({status:"No active categories"});
        }
        
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
  
}


const postLang = async (req,res)=>{
    try{
        const body = req.body;
        const langs = lang.create(body);

        if(!langs){
            throw 'Something unusual happened during the process';
        }
        res.json({langs});
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
}

module.exports={
    getLangs,
    postLang
}