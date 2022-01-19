const Login = async(user)=>{
    try{
        const result = await fetch('/user/login',{
            method:'POST',
            body:JSON.stringify(user),
            headers:{'Content-type':'application/json'}
        })
        
        if(result.status>=400){
            let data = await result.json();
            throw data.error;
        }

        const data = await result.json();
        return data;
    }
    catch(error){
        throw error

    }
}


const SignUp = async(user)=>{
    try{

        const result = await fetch('/user/signup',{
            method:'POST',
            body:JSON.stringify(user),
            headers:{'Content-type':'application/json'}
        });

        if(result.status>=400){
            let data = await result.json();
            throw data.error;
        }

        const data = await result.json();
        return data
    }
    catch(error){
        throw error;

    }
}





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
                
                if(respond.status>=400){
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