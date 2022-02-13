const mongoose = require('mongoose'); 
const{currentTime}=require('../util/utils');

const Schema = mongoose.Schema;

const categorySchema=new Schema({
    title:{
        type:Array,
        required:[true,'Category Title missing'],
        unique:[true,'Category name is required'],
        lowercase:false
    },
    active:{
        type:Boolean,
        required:true,
        default:false

    }
   
},{
 timestamps:true
});



const category = mongoose.model('category',categorySchema);


module.exports= category;

