const _newAcct = $('#newAcct');
const _userHolder = $('#userNom');

// Elements
const loginBtn = $('#loginBtn');

const form = document.querySelector('form');
const email_err = $('.email');
const username_err = $('.username');
const password_err = $('.password');
const status_err = $('.status');




_newAcct.on('click',()=>{
    _userHolder.slideToggle( "slow",()=>{
        if(loginBtn.text()==='Login' ){
            loginBtn.text('SignUp');
            // loginBtn.attr('id','signup');
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
        alert(`user name:${form.email.value} and password:${form.password.value} `);

        
        
        break;
    case 'SignUp':
        // signUp
        alert(`user name:${form.email.value},usrname:${form.userName.value} and password:${form.password.value} `);

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
    
            // console.log(email,password);
            try{
                const result = await fetch('/user/signup',{
                    method:'POST',
                    body:JSON.stringify({email,password,username}),
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

