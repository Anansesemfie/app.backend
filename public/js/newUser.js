


const _newAcct = $('#newAcct');
const _userHolder = $('#userNom');

// Elements
const loginBtn = $('#loginBtn');

const form = document.querySelector('form');
const email_err = document.querySelector('.email.error');
const username_err = document.querySelector('.username.error');
const password_err = document.querySelector('.password.error');
const status_err = document.querySelector('.status.error');

//query string from URL
const queryString = window.location.search;
const parameters = new URLSearchParams(queryString);
const redirect = parameters.get('redirect');
// alert(redirect);



const attemptLogin = async (email,password,source)=>{
    try{
        let data = await Login({email,password,source});
        if(!data){
            throw 'Error attempting to login'
        }
        let toHere = '/'
                        if(redirect){
                            // alert(redirect);
    
                            toHere=redirect;
                        }
                        //redirect here
                        location.assign(toHere);

    }
    catch(error){
        toast({message:error,title:'Login status',bg:'bg-warning'});
    }
}


const attemptSignUp = async(email,password,username,account)=>{
    try{
        let data = await SignUp({email,password,username,account});
        if(!data){
            throw 'Error attempting to Create Account'
        }
        toast({message:`verication request sent to email: ${email}`,title:'SignUp status',bg:'bg-success'});
        return true;

    }
    catch(error){
        toast({message:error,title:'Signup status',bg:'bg-warning'});
    }
}

const resetPassword = async(email)=>{//forgot password
    try{
        const data = await forgotPassword(email);
        if(!data){
            throw 'Error attempting to Reset Password';
        }
        toast({message:`New Password sent to: ${email}`,title:'Forgot Password',bg:'bg-success'});
        return true;

    }
    catch(error){
        // console.log(error);
        toast({message:error,title:'Forgot Password',bg:'bg-warning'});
    }
}


const resend_verify = async (email)=>{
    try{
        const data = await resendVerification(email);
        if(!data){
            throw 'Error attempting to Resend Verification';
        }
        toast({message:`New Verification sent to: ${email}`,title:'Account Verification',bg:'bg-success'});
        return true;

    }
    catch(error){
         console.log(error);
        toast({message:error,title:'Account Verification',bg:'bg-warning'});
    }
}



$(document).ready(async()=>{
    try{
         // New account procedure   
    _newAcct.on('click',async ()=>{
        _userHolder.slideToggle( "slow",()=>{
            if(loginBtn.text()==='Login' ){
                loginBtn.text('SignUp');
                //Events for signUp
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
            }
            else{
                loginBtn.text('Login');
                // loginBtn.attr('id','login');
            }
    
        })
    })
    // New account procedure

    let mod = await initModal();
        toastHolder(); // toast holder
       $('.toast').toast('show');

       $('#forgot_password').on('click',()=>{//forgot password trigger
        $('.modal-body').html('');
        forgotForm('.modal-body');

        $('#myModal').modal('toggle');

        $('#proceed_fgt').on('click',async ()=>{//forgot password controller
            try{
                        const myEmail = $('#forgot_email').val();
                let resetted = await resetPassword(myEmail);
                if(!resetted){
                    throw 'Something went wrong';
                    
                }
                    $('#forgot_email').val('')

            }
            catch(error){
                throw error;

            }
            
       })



       })


       $('#resend_verify').on('click',()=>{//forgot password trigger
        
        $('.modal-body').html('');
        resendForm('.modal-body');

        $('#myModal').modal('toggle');

        $('#proceed_resend').on('click',async ()=>{
            try{
              
                const myEmail = $('#resend_email').val();
                let resetted = await resend_verify(myEmail);

                if(!resetted){
                    throw 'Something went wrong';
                    
                }
                    $('#resend_email').val('')
            }
            catch(error){

                throw error;
            }
            


        })




       })

   


    //    login or signUp button click
    loginBtn.on('click',()=>{
        try{
        switch (loginBtn.text()) {
        case 'Login':
            // login
    
            form.addEventListener('submit', (e)=>{
                     e.preventDefault();
        
                let email = form.email.value;
                let password = form.password.value;
                let source = 'Web';
        
                // console.log(email,password);
                // try{
                   attemptLogin(email,password,source);

            })
            
            break;
    
        case 'SignUp':
           
    
            form.addEventListener('submit',(e)=>{
                e.preventDefault();
                
        
                //get values
                let email = form.email.value;
                let password = form.password.value;
                let username =form.userName.value;
                let account = "Consumer";
                
                    if(password!==$('#pass_2').val()){
                        throw 'Passwords are not the same';
                    }
                   let data = attemptSignUp(email,password,username,account);
                    if(data.user){
                        email.text('');
                        password.text('');
                        username.text('');
                    }
        
               
        
            })
    
        break;
    
        default:
            alert('This action is not recognized')
            break;
    }
    }
    catch(error){
        // console.log(error);
     toast({message:error,title:'Attention',bg:'bg-warning'});
    }
    })

//    login or signUp button click
    }
    catch(error){
        toast({message:error,title:'OOOPS',bg:'bg-warning'});
    }

       
})


