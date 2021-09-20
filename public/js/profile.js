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

//hidden
const edit = $('#user_edit');//if user? edit
const fb = $('#user_fb');//facebook
const ig = $('#user_ig')//instagram
const twi = $('#user_twi')//twitter
const tel = $('#user_tel')//phone

const myLiked = $('#myLiked')//liked book container
const myCreated = $('#myCreated')//liked book container

//insert user details
const setUser = async (user)=>{
    try{
        if(user.myself){//this is my profile
            edit.css('display','block');
            
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

        if(books.Books.created.length>0){//have Created books
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
            await setUser(thisUser);

            //get user books
                console.log('Done');
                let user_books = await userBooks({user});
                setBooks(user_books);
            
           
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
        // if(!readyUser){
        //     throw 'There was an usual problem';
        // }
    }
    catch(error){
        toast({message:error,title:'Trouble with user',bg:'bg-danger'});
    }

})