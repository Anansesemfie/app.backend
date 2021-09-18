const link =window.location.href;
const params = link.split('/');

const user = params[5];

const dp = $('#user_pic');//profile picture
const nom = $('#user_name');//user name
const mail = $('#user_mail');//Email
const loc =$('#user_loc');//location if any
const bio = $('#user_bio');//user bio
const Ubks = $('#user_books');//user books
const books = $('#__books')//book count
const cover = $('.cover');

//hidden
const edit = $('#user_edit');//if user? edit
const fb = $('#user_fb');//facebook
const ig = $('#user_ig')//instagram
const twi = $('#user_twi')//twitter
const tel = $('#user_tel')//phone

//insert user details
const setUser = (user)=>{
    try{
        if(user.myself){//this is my profile
            edit.css('display','block');
            if(Ubks.css('display','block')){
                books.text('500');
            }
        }

        //handles..................
        // if(user.user.fb){
        //     //show facebook
        // }
        // if(user.user.ig){
        //     //show instagram
        // }
        // if(user.user.twi){
        //     //show twitter
        // }
        // if(user.user.tel){
        //     //show phone
        // }

        //handles...................
        console.log(user.myself)
        let newDP = `/images/${user.user[0].dp}`
        dp.attr('src',newDP);//dp
        cover.css('background-image',`url('${newDP}')`)
        nom.text(user.user[0].username);//username
        mail.text(user.user[0].email);//email
        if(user.user[0].bio){
            bio.text(user.user[0].bio);
        }
        else{
            bio.text('This user is secretive');
        }





        
    }
    catch(error){
console.log(error);
    }   
}

//get User details
const get_user = async()=>{
    try{
        const thisUser = await getUser({user});
        if(thisUser){
            setUser(thisUser);
           
        }
    }
    catch(error){
        toast({message:error,title:'Could get user details',bg:'bg-danger'});
    }
}


$(document).ready(async ()=>{
    try{
        toastHolder(); // toast holder
       $('.toast').toast('show');

        const readyUser=await get_user();
        if(!readyUser){
            throw 'There was an usual problem';
        }
    }
    catch(error){
        toast({message:error,title:'Trouble with user',bg:'bg-danger'});
    }

})