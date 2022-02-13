const mongoose = require('mongoose'); 
const{currentTime}=require('../util/utils');

const Schema = mongoose.Schema;

const langSchema=new Schema({
    title:{
        type:Array,
        required:[true,'Language Title missing'],
        unique:[true,'Language name is required'],
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



const langs = mongoose.model('language',langSchema);


module.exports= langs;

