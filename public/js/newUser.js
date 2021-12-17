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

loginBtn.on('click',()=>{
    switch (loginBtn.text()) {
    case 'Login':
        // login
        // alert(`user name:${form.email.value} and password:${form.password.value} `);

        form.addEventListener('submit', async(e)=>{
            e.preventDefault();
    
            //reset errors
            email_err.textContent = '';
            password_err.textContent = '';
            
    
            //get values
            let email = form.email.value;
            let password = form.password.value;
    
            // console.log(email,password);
            try{
                const result = await fetch('/user/login',{
                    method:'POST',
                    body:JSON.stringify({email,password}),
                    headers:{'Content-type':'application/json'}
                });
    
                const data = await result.json();
    
                console.log(data);
                if(data.errors){
                    email_err.textContent = data.errors.email;
                    password_err.textContent=data.errors.password;
                    status_err.innerHTML=data.errors.status;
                    
    
    
                }
                
                if(data.user){
                    let toHere = '/'
                    if(redirect){
                        // alert(redirect);

                        toHere=redirect;
                    }
                    //redirect here
                    location.assign(toHere);
                }
    
            }
            catch(err){
                throw err;
            }
    
    
        });
        
        break;

    case 'SignUp':
        // signUp
        // alert(`user name:${form.email.value},usrname:${form.userName.value} and password:${form.password.value} `);

        form.addEventListener('submit', async(e)=>{
            e.preventDefault();
    
            //reset errors
            email_err.textContent = '';
            password_err.textContent = '';
            username_err.textContent='';
            
    
            //get values
            let email = form.email.value;
            let password = form.password.value;
            let username =form.userName.value;
            let account 
            if(form.accountType.checked){
               account="Creator";
            }
            else{
                account="Consumer";
            }
    
            // console.log(email,password);
            try{
                if(password!==$('#pass_2').val()){
                    throw 'Passwords are not the same';
                }
                const result = await fetch('/user/signup',{
                    method:'POST',
                    body:JSON.stringify({email,password,username,account}),
                    headers:{'Content-type':'application/json'}
                });
    
                const data = await result.json();
    
                console.log(data);
                if(data.errors){
                    email_err.textContent = data.errors.email;
                    username_err.textContent = data.errors.username;
                    password_err.textContent=data.errors.password;
                    
    
    
                }
                if(data.user){
                    alert(`verication request sent to email: ${email}`);
                    location.reload();
                }
    
            }
            catch(err){
                throw err;
            }
    
    
        });

    break;

    default:
        alert('This action is not recognized')
        break;
}
})

$(document).ready(async()=>{
    try{

    let mod = await initModal();
        toastHolder(); // toast holder
       $('.toast').toast('show');

       $('#forgot_password').on('click',()=>{
        $('.modal-body').html('');
        forgotForm('.modal-body');

        $('#myModal').modal('toggle');

        $('#proceed_fgt').on('click',async ()=>{
        let resetted = await forgotPassword();
        if(resetted){
            toast({message:resetted.user,title:'Account status',bg:'bg-success'});
            $('#forgot_email').text('')
        }
        else{
            throw 'Something went wrong';
        }
       })

       })

    }
    catch(error){
        toast({message:error,title:'OOOPS',bg:'bg-warning'});
    }

       
})


const forgotPassword = async ()=>{
    try{    
        const myEmail = $('#forgot_email').val();

        const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                const raw = JSON.stringify({email:myEmail});
                // console.log(raw);
                
                const requestOptions = {
                  method: 'PUT',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };

                let respond = await fetch('/user/reset',requestOptions);
                
                if(respond.status==404||respond.status==403){
                throw respond.json().error;
                }
                else{   
                        return respond.json();
                }

    }
    catch(error){
        throw error;
    }
}