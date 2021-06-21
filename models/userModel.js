const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']

    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[6,'Minimum password length is 6 characters']

    },
    username:{
        type:String,
        lowercase:true,
        minlength:[2,'Username has to be longer'],
        required:[true,'username is required']
    },
    active: {
        type: Boolean, 
        default: false
      },
      key:{
          type:String,
          require:false,
          unique:true
      }
});


//fire a function before a doc is save to DB
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(this.password,salt);

    next();
});

//static method to login
userSchema.statics.login=async function(email,password){
    const user = await this.findOne({email});//search for email/username
    if(user){
        const auth = await bcrypt.compare(password,user.password);//compare received password with user.password
        if(auth){
            if(user.active){
                return user;
            }
            else{
                throw Error('Account is not Active');
            }
           
        }
        throw Error('Password is incorrect');
    }
    throw Error('incorrect email');
};

const user = mongoose.model('User',userSchema);

module.exports=user;