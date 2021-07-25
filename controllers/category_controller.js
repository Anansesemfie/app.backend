const cate = require('../models/category');

const getCategories = async (req,res)=>{
    try{
        let categories = await cate.find({active:true});
        if(categories){
            console.log(categories);
            let cat = JSON.encode(categories);
            // res.json({categories});
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