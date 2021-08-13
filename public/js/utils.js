const getCategory = async ()=>{//get all categories
try{
        let result = await fetch("/category/");
        let data = await result.json();
        
        
        return data.categories;
}
catch(err){
        alert(`Attention, Connection to server broke\n check your internet connection `);
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
                console.log(err);
        }  
}

const getBooks = async ()=>{//all available books
        try{
        let result = await fetch(`/book/`,{
                method: 'GET',
                redirect: 'follow'}
              );
        if(result.status==404){
                throw 'Something went wrong whiles getting books';
        }
        let data = await result.json();
       
        
        return data.books;

        }
        catch(err){
        console.log(err);
        }
}


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
                console.log(err);
        }
}

const postReaction = async (book,action)=>{
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
                console.log(err);
        }
}


const getReaction = async (book)=>{
        try{
                const reacts = await fetch(`/react/${book}`,{method:'GET'});
                //  console.log(reacts);
                if(reacts){
                        let res = reacts.json();
                        return res;

                }
        }
        catch(err){
                console.log(err);
        }
}

const postSeen = async (book)=>{
        try{
                const seen = await fetch(`/react/seen/${book}`,{method:'POST'});
                if(seen){
                        console.log(seen);
                }
        }
        catch(err){
                console.log(err);
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
                console.log(err);
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
        if(respond.status==200){
                alert('Comment sent');
        }
        }
        catch(err){
                console.log(err);
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

        }
}