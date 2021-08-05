const getCategory = async ()=>{//get all categories
try{
        let result = await fetch("/category/");
        let data = await result.json();
        // console.log(data.categories);
        
        return data.categories;
}
catch(err){
        alert(`Attention, Connection to server broke\n check your internet connection `);
}
}


const getBookdetails = async(book)=>{// a single book details
        try{
                // console.log(book);
        let result = await fetch(`/book/${book}`);
        if(result.status == 404){
                throw 'check internet connection';
        }
        let data = await result.json();
        // console.log(data.bookBack);

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
        // console.log(data.books);
        
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
                // console.log(data.validChaps);
                
                return data.validChaps;
                

        }
        catch(err){

        }
}