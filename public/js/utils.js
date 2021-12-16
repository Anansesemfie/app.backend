
const getCategory = async ()=>{//get all categories
try{
        let result = await fetch("/category/");
        let data = await result.json();
        
        if(!data.categories){
                throw 'Troublr getting categories';
        }
        return data.categories;
}
catch(err){
        throw err;
}
}

const getLanguages = async ()=>{//get all categories
        try{
                let result = await fetch("/langs/");
                let data = await result.json();
                
                if(!data.languages){
                        throw 'Troublr getting categories';
                }
                return data.languages;
        }
        catch(err){
                throw err;
        }
        }


const getBookdetails = async(book)=>{// a single book details
        try{
                
        let result = await fetch(`/book/${book}`);
        if(result.status == 404){
                throw 'check internet connection';
        }
        let data = await result.json();
        

        return data;

        }
        catch(err){
                throw err;
        }  
}

const getBooks = async ()=>{//all available books
        try{
        let result = await fetch(`/book/`,{
                method: 'POST',
                redirect: 'follow',
                data:{
                        "active": false
                }}
              );
        if(result.status==404){
                throw 'Something went wrong whiles getting books';
        }
        let data = await result.json();
       
        
        return data.books;

        }
        catch(err){
                throw err;
        }
}

// CHapter
const getChapters = async(book)=>{
        try{
                let result = await fetch(`/chapter/${book}`,{
                        method: 'GET',
                        redirect: 'follow'}
                      );

                if(result.status==404){
                        throw 'Something went wrong whiles getting books';
                }

                let data = await result.json();
                
                return data.validChaps;
                

        }
        catch(err){
                throw err;
        }
}


const postReaction = async (book,action)=>{//send reaction
        try{
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                const raw = JSON.stringify({
                  book,
                  action
                });
                console.log(raw);
                
                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };

        let respond = await fetch('/react/like',requestOptions);
        if(respond){
              let res= respond.json();
              
              // console.log(res);
        // if(res.status===400){
        //         throw 'Something went wrong';
        // }
        // else if(res.status===300){
        //         alert('Be warned');
        // }
        // else{
        //         alert('Action was successful');

        // }
        
        return res;
        }
        
        

       

        }
        catch(err){
                throw err;
        }
}


const getReaction = async (book)=>{//get reactions 
        try{
                const reacts = await fetch(`/react/${book}`,{method:'GET'});
                //  console.log(reacts);
                if(reacts){
                        let res = reacts.json();
                        return res;

                }
        }
        catch(err){
                throw err;
        }
}

const postSeen = async (book)=>{
        try{
                const seen = await fetch(`/react/seen/${book}`,{method:'POST'});
                if(seen){
                        return 0;
                }
        }
        catch(err){
                throw err;
        }
}

const getSeen = async (book)=>{
        try{
                const seen = await fetch(`/react/seen/${book}`,{method:'GET'});
                if(seen){
                        let res = seen.json();
                        // console.log(res);
                        return res;
                }
        }
        catch(err){
                throw err;
        }
}


//comments
const postComment = async (book,comment)=>{
        try{
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                const raw = JSON.stringify({
                  book,
                  comment
                });
                // console.log(raw);
                
                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };

        let respond = await fetch('/react/comment',requestOptions);
        // console.log(respond.status);
        if(respond.status==403){
                throw 'Not logged in';
        }
        else{
                return true
        }
        }
        catch(err){
                throw err;
        }
}

const getComments = async (book)=>{
        try{

              let respond = await fetch(`/react/comment/${book}`,{ method: 'GET' });
              if(respond.status==200){
                      let res = respond.json();

                      return res;
              }
        }
        catch(err){
                throw err;
        }
}



//media stuff
const getFile = async (chapter)=>{
        try{
                let response = await fetch(`/file/${chapter}`, {method:'GET'});
                if(response.status==404){
                        throw 'Trouble Getting audio file'

                }
                else{
                        return response.json();
                }


        }
        catch(err){
                throw err;
        }

}


//search
const search =async(keyword)=>{
        try{
                let response = await fetch(`/filter/find?keyword=${keyword}`, {method:'GET'}); 
                // console.log(response.status);
                if(response.status===404){
                        
                        throw 'Not found';

                }
                else if(response.status===403){
                        let error =await response.json();
                        if(error.error==''){
                                error.error='Unknown Issues';
                        }
                        throw error.error;
                }
                else{
                        return response.json();
                }


        }
        catch(error){
                throw error;
        }
}
//filter
const Filter = async (query)=>{
        try{
                query.played = parseInt(query.played);
                // console.log(query);


        let respond = await fetch(`/filter/speci?played=${query.played}&category=${query.category}&language=${query.language}`,{method:"GET"});

        if(respond.status==404||respond.status==403){
                throw 'Something unexpected happened, check your connection'
        }
        return respond.json();

        }
        catch(error){           
                throw error;
        }
}

const expandFilter = async(fstParam,lstParam)=>{//Expand Filtering
        try{
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                const raw = JSON.stringify({
                  fstParam,
                  lstParam
                });
                // console.log(raw);
                
                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };
                let respond = await fetch('/filter',requestOptions);//fetch 


                if(respond.status>=400){
                        throw new Error(response.status);
                }

                return respond.json()

        }

        catch(error){
                throw error;
        }
}





//user 
const getUser=async(user)=>{
        try{ 
                if(!user.user){
                        throw `Don't try to be too smart`;
                }

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                const raw = JSON.stringify(user);
                // console.log(raw);
                
                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };

        let respond = await fetch('/user/profile/fetch',requestOptions);
        if(respond.status==404||respond.status==404){
                throw '404';
                location.assign('/');
        }

        return respond.json();


        }
        catch(error){
                throw error;
        }
}

const updatePassword =async (password)=>{
        try{
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                const raw = JSON.stringify({password});
                // console.log(raw);
                
                const requestOptions = {
                  method: 'PUT',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };

                let respond = await fetch('/user/',requestOptions);
                
                if(respond.status==404||respond.status==404){
                throw '404';
                }
                else{   
                        return respond.json();
                }

        }
        catch(error){
                throw error;
        }
}

const userBooks = async (user)=>{
        try{
                if(!user.user){//if no user
                        throw `Don't try to be too smart`;

                }
                 //there is a user 
                 const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                const raw = JSON.stringify(user);
                // console.log(raw);
                
                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };

        let respond = await fetch('/book/user',requestOptions);
        if(respond.status==404||respond.status==404){
                throw '404';
                location.assign('/');
        }

        return respond.json();

        }
        catch(error){

        }

}


// subscription
const getSubscriptions = async ()=>{
        try{
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                const raw = JSON.stringify({active:'true'});
                // console.log(raw);
                
                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };

        let respond = await fetch('/subscribe/all',requestOptions);
        if(respond.status==404||respond.status==404){
                throw '404';
        }

        return respond.json();
        }
        catch(error){
                throw error
        }
}