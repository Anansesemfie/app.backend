const link =window.location.href;
const params = link.split('/');

const user = params[5];

const dp = $('#user_pic');//profile picture
const nom = $('#user_name');//user name
const mail = $('#user_mail');//Email
const loc =$('#user_loc');//location if any
const bio = $('#user_bio');//user bio
const Ubks = $('#user_books');//user books
const __books = $('#__books')//book count
const cover = $('.cover');
const subState = $('#subState');//subscription color
const subInfo = $('#subInfo');//subscription info

//hidden
const edit = $('#user_edit');//if user? edit
var account;
// const fb = $('#user_fb');//facebook
// const ig = $('#user_ig')//instagram
// const twi = $('#user_twi')//twitter
// const tel = $('#user_tel')//phone

const myLiked = $('#myLiked')//liked book container
const myCreated = $('#myCreated')//liked book container

//insert user details
const setUser = async (user)=>{
    try{
        if(user.myself){//this is my profile
            edit.css('display','block');

            if (user.user.bank){//if account details are available
                account = user.user.bank;
            }

            subState.css({'color': 'white', 'border-radius':'10px', 'background-color' : '#00D84A'});
            subInfo.text(user.subscription.info)
            if(!user.subscription.active){
                subState.css({'background-color' : '#E8BD0D'});
                subInfo.append(`
                <a class="button btn cat" href="/subscribe">Activate a new Subscription</a>
                `)
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
        // console.log(user.myself)
        let newDP = user.user.dp;
        dp.attr('src',newDP);//dp
        cover.css('background-image',`url('${newDP}')`)
        nom.text(user.user.username);//username
        mail.text(user.user.email);//email
        if(user.user.bio){
            bio.text(user.user.bio);
        }
        else{
            bio.text('This user is secretive');
        }
        if(user.user.account=="Consumer"){
            $('#upBooks').css({'display':'none'});
        }

        return {myself:user.myself};

    }
    catch(error){
        throw error;
    }   
}

const setBooks = async(books)=>{
    try{
        if(books.Books.liked.length>0){//have liked books
            books.Books.liked.forEach(bk=>{
                ad_card(bk,'myLiked');
            });
        }
        else{
            myLiked.append(`<center>
            <a href="/" class="button cat btn-lg btn-block">Looks like No one has caught your eyes, guess again</a>
            </center>`)
        }

        if(books.Books.created){//have Created books
            Ubks.css('display','block');
            if(Ubks.css('display','block')){//show number of books
                __books.text(books.Books.created.length);
            }

            //set books
            books.Books.created.forEach(bk=>{
                ad_card(bk,'myCreated');
            });



        }
        else{
            myCreated.append(`<center>
            <a href="/" class="button cat btn-lg btn-block">Try and upload your first Book</a>
            </center>`)
        }

        
    }
    catch(error){
        throw error;
    }
}



//get User details
const get_user = async()=>{
    try{
        const thisUser = await getUser({user});

        if(thisUser){
            let jstUser=await setUser(thisUser);
            

            //get user books
                // console.log('Done');
                let user_books = await userBooks({user});
                setBooks(user_books);
            
           return jstUser
        }
    }
    catch(error){
        toast({message:error,title:'Could not get user details',bg:'bg-danger'});
    }
}

// Main start

$(document).ready(async ()=>{
    try{
        let mod = await initModal();
        toastHolder(); // toast holder
       $('.toast').toast('show');

        const readyUser=await get_user();
        if(readyUser.myself){//this is my account

            edit.on('click',()=>{
                $('.modal-body').html('');
                userForm('.modal-body');

                $('#myModal').modal('toggle');

                showEdit()
                editEvents();
            })
           
        }
    }
    catch(error){
        toast({message:error,title:'Trouble with user',bg:'bg-danger'});
    }

})

// Main end

const showEdit= async()=>{
    try{
        $('#Uname').val($('#user_name').text());//user name
        $('#Ubio').val($('#user_bio').text());//user name

        //account info
         $('#bankName').val(account.bank);//account name
        $('#accountName').val(account.name);//account name
        $('#accountNumber').val(account.number); //account number
        $('#accountBranch').val(account.branch); //account branch

    }
    catch(error){

    }
}


const editEvents =()=>{

    try{
       $('#logDetails').on('click',async ()=>{//toggle login details
            $('#userLog').slideToggle( "slow",()=>{

            $('#shwPass').on('click',()=>{//show password
                    // alert('checked')
             if(document.getElementById('shwPass').checked){
                $('#pass_1').attr('type','text');
                $('#pass_2').attr('type','text');
             }
             else{
                $('#pass_1').attr('type','password');
                $('#pass_2').attr('type','password');
             }
            
            })

        $('#pass_1').on('blur',async ()=>{//leave first pass field
            if($('#pass_1').val()){
                let strength = await passStrenght($('#pass_1').val());
            if(strength){
                 $('#pass_1').css('border','2px green solid');
            $('#pass_1').attr('title','Strong password');
            }
            else{
                $('#pass_1').css('border','2px brown solid');
                throw `<p>Password Must have atleast one <b>UPPERCASE alphabet</b></p>
                <p>Password Must have atleast one <b>Special character</b></p>
                <p>Password Must have atleast one <b>number</b></p>
                <p>Password Must have atleast <b>eight(8) characters</b></p>
                `;
            }
            }
            
            
        })

        $('#pass_2').on('blur',async ()=>{//leave first pass field
           if($('#pass_2').val()===$('#pass_1').val()){
            $('#pass_2').css('border','2px green solid');
            $('#pass_2').attr('title','Passwords match');
           }
           else{
            $('#pass_2').css('border','2px brown solid');
            $('#pass_2').attr('title','Does not match');
            throw`<p>Passwords <b>DO NOT MATCH</b></p>
            <p>Tip: show passwords to be sure</p>
            `;
           }
            
            
        })



            });
        })


        //update password
        $('#updateInfo').on('click',async ()=>{
          
            const fstPass =$('#pass_2').val();
            const scdPass =$('#pass_1').val();
            if(!fstPass||!scdPass){
                throw 'Enter your new password';
            }
            if(fstPass===scdPass){//check passwords
                let passSent = await updatePassword(fstPass);
                if(passSent.done){
                    //   alert('Password updated');
                    $('#pass_2').val('');
                    $('#pass_1').val('');
               
                    toast({message:'Password successfully Updated',title:'Update',bg:'bg-success'});
                 }   
                else{
                    throw 'Could not update password';
                }

            }
            else{//passwords don't matchS
                throw `Passwords don't match`;
            }
        })

        //update account 
        $('#updateAccount').on('click',async()=>{
            let accountName = $('#accountName').val();
            let accountNumber = $('#accountNumber').val();
            let accountBranch = $('#accountBranch').val();
            let bankName =$('#bankName').val();

            const bank = await updateBank({accountName, accountNumber,accountBranch,bankName});
            if(!bank){
                throw 'Error updating bank account details'
            }

            toast({message:'Bank Account Details successfully Updated',title:'Update',bg:'bg-success'});

            // console.log(accountName,accountNumber,accountBranch);
            // alert('account btn clicked')
        })
         

        




    }
    catch(error){
        toast({message:error,title:'Update Issue',bg:'bg-danger'});
    }
}


