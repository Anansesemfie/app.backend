const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const { ObjectId } = require('bson');

const account = new mongoose.Schema({
    bank:{
        type:String,
        required:[true,'Banck name required']
    },
    name:{
        type:String,
        required:[true,'Name is required']
    },
    number:{
        type:String,
        required:[true,'Number is required']
    },
    branch:{
        type:String,
        required:[true,'Branch is required']
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
        unique:[true,'Email is unique'],
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
      loggedin:{
        type:Boolean,
        required:true,
        default:false
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
     bank:{
         type:account,
         required:false
     },
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
    try{
        const user = await this.findOne({email});//search for email/username
    if(!user){
        throw 'incorrect email';
    }

    const auth = await bcrypt.compare(password,user.password);//compare received password with user.password
        if(!auth){
            throw 'Password is incorrect';
        }
        
        if(!user.active){
                throw 'Account is not Active';
            }
        if(user.loggedin){
            throw "Account logged in already else where"
        }
        await this.updateOne({_id:user._id},{loggedin:true});

     return user;
    }
    catch(error){
        console.log(error);
        throw error;
    }
    
}

userSchema.statics.subscription = async function(info,subss,subs){
    try{
        // console.log(info,subss,subs);
        let user = await this.findOne({_id:info.user,active:true});
        if(!user){
            throw 'User is either not active or not found';
        }
        if(user.subscription){
            console.log('Not a new user')
            return;

        }
        else{
            let sub = await subs.findOne({_id:info.subscription,active:true});
        console.log(sub);
        if(!sub){
            throw 'Subscription is not active';
        }
        let parentSub = await subss.findOne({_id:sub.subscription,active:true});

        let subLimit = await this.countDocuments({subscription:info.subscription});

        if(subLimit>parentSub.users){
            throw 'Maximum users exceeded';
        }

        // update user now 
        let newSub = await this.updateOne({_id:info.user},{subscription:info.subscription});
        if(!newSub){
            throw `couldn't update subscription`
        }
        return newSub;

        }
        
    }
    catch(error){
        throw error;
    }
}

userSchema.statics.info = async function(id){
    // console.log(id);
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

userSchema.statics.users = async function(params){
    try{
        const {accountType,status} = params;//Deconstruct params
        // console.log(accountType,status);
        let Users ;
        const exempt ='-__v -moment -email -password -key -subscription -bio -account -active -handles';

        switch (status) {
            case 'Active':
                    // console.log('Active');
                //active accounts
                Users = await this.find({account:accountType,active:true},exempt);
                if(!Users){
                    throw 'Error getting users';
                }
                // console.log(Users);
                // Users=activeUsers;

                
                break;
        
            default:
                console.log('All');
                Users = await this.find({account:accountType},exempt);
                if(!Users){
                    throw 'Error getting users';
                }
                // Users=allUsers;
                break;
        }

        return Users;


    }
    catch(error){
        throw error
    }
}

// static method to follow user


// static method to unfollow

const user = mongoose.model('User',userSchema);

module.exports=user;