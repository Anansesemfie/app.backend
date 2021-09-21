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
alert(redirect);


_newAcct.on('click',async ()=>{
    _userHolder.slideToggle( "slow",()=>{
        if(loginBtn.text()==='Login' ){
            loginBtn.text('SignUp');
            // _accountHolder.slideToggle('slow',()=>{
            //     return true;
            // });
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
                    if(redirect){

                        location.assign(redirect);
                    }
                    //redirect here
                    location.assign('/');
                }
    
            }
            catch(err){
                console.log(err);
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
                console.log(err);
            }
    
    
        });

    break;

    default:
        alert('This action is not recognized')
        break;
}
})

