const category = require('../models/category');
const exempt = '-__v -status -active -_id';

const getCategories = async (req,res)=>{
    try{
        let categories = await category.find({active:true},exempt);
        if(categories){
            
            res.json({categories});
        }
        else{
            res.json({status:"No active categories"});
        }
        
    }
    catch(err){
        throw err;
    }
  
}


const postCategory = async (req,res)=>{
    try{
        let body = req.body;
        console.log(body);
    }
    catch(err){

    }
}

module.exports={
    getCategories,
    postCategory
}