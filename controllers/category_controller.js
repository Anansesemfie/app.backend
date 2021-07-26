const cate = require('../models/category');

const getCategories = async (req,res)=>{
    try{
        let categories = await cate.find({active:true});
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