const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema=new Schema({
    title:{
        type:String,
        unique:[true,'Category name is required']
    },
    active:{
        type:Boolean,
        default:false
    }
   
},{
 timestamps:true
});



const category = mongoose.model('category',categorySchema);


module.exports= category;

