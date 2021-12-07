const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const { ObjectId } = require('bson');

const handleSchema = new mongoose.Schema({
    linkType:{
        type:String,
        required:false
    },
    href:{
        type:String,
        required:false
    },
    moment:{
        type:Date,
        default:mongoose.now()
    }
},{
    timestamp:true
});


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
        minlength:[2,'Username is too short..'],
        required:[true,'username is required']
    },
    account:{
        type:String,
        required:[true,'Please Select account type']
      },
    active: {
        type: Boolean, 
        default: false
      },
      dp:{
        type:String,
        default:'/images/dp.png',
      },
     bio:{
        type:String,
        required:false,
        default:'This user is secretive'
     },
     handles:[handleSchema],
      key:{
          type:String,
          require:false
        
      },
      subscription:{
        type:ObjectId,
        required:false
      },
      moment:{
          type:Date,
          default:mongoose.now()
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
}

userSchema.statics.subscription = async function(info,subs){
    try{
        let user = await this.findOne({_id:info.user,active:true});
        if(!user){
            throw 'User is either not active or not found';
        }

        let sub = await subs.findOne({_id:info.subscription,active:true});
        if(!sub){
            throw 'Subscription is not active';
        }
        let subLimit = this.find({subscription:info.subscription});

        if(subLimit>=sub.maxUsers){
            throw 'Maximum users exceeded';
        }

        // update user now 
        let newSub = await this.findByIdAndUpdate({_id:info.user},{subscription:info.subscription});
        if(!newSub){
            throw `couldn't update subscription`
        }
        return newSub;

        
    }
    catch(error){
        throw error;
    }
}

userSchema.statics.info = async function(id){
    console.log(id);
    const user = await this.findById({_id:id,Active:true});
    // console.log(user);
    if(!user){
        return null;
    }

    return {
        email: user.email,
        id: user._id
    }
    

}

// static method to follow user


// static method to unfollow

const user = mongoose.model('User',userSchema);

module.exports=user;