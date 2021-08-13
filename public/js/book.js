const link =window.location.href;
const params = link.split('/');

const action=params[4];
const book = params[5];


//page elements
const cover = $('#bookCover');
const title = $('#bookTitle');
const description = $('#description');
const ifUser = $('#ifUser');



//reactions
const likes = $('#like_count');
const dislikes = $('#dislike_count');

//stats
const seens = $('#seen');


const loadBook = async ()=>{
    try{
        const details = await getBookdetails(book);
        if(!details){
            location.href="/";
        }

    //fill the blanks
    cover.attr('src',details.bookBack.cover);
    title.text(details.bookBack.title);
    description.text(details.bookBack.description);

    if(details.creator){
        ifUser.append(
           
            $('<button/>',{'class':'button btn cat signin','id':'chapter'}).append('Add Chapter'),
            // $('<button/>',{'class':'button btn cat signin','id':'update'}).append('Update')
        );
        
    }

    details.bookBack.category.forEach(cat => {//print categories
        addCategory(cat,'category');
    });
    details.bookBack.authors.forEach(author=>{//print authors
        addAuthor(author,'Authors');
    });
    }
    catch(err){
        console.log(err);
    }



}

const Liking = async ()=>{
    const reacted = await postReaction(book,'Like');
    if(reacted){
       
    }

}

const Disliking = async ()=>{
    const reacted = await postReaction(book,'Dislike');
    if(reacted){
      
    }

}

const reactions = async ()=>{//get all reactions...............................
    const reacts = await getReaction(book);
    if(reacts){
        // console.log(reacts);
        likes.text(reacts.likes);
        dislikes.text(reacts.dislikes);

    }
}

//Seen
const post_seen = async ()=>{//post seen
    try{
        const see = await postSeen(book);
            if(see){
                console.log(see);
            }
    }
    catch(err){

    }
   
}

const get_seen = async ()=>{//get seen
    try{
        const saw = await getSeen(book);
            if(saw){
                
                seens.text(saw.seen);
            }
    }
    catch(err){

    }
    
}

const get_comments = async ()=>{//get all comments
    try {
        const coms = await getComments(book);
        if(coms){
            console.log(coms.comments);
        }
        else{

        }
    } 
    catch (error) {
        
    }

}



const loadChapters = async () =>{//load chapters if any..............................................
    try{
       let back;
        const details = await getChapters(book);
        //  console.log('in load',details);
        if(details.length==0){
            $('#Chapters').append(`
            <center>
            <a href="/" class="button cat btn-lg btn-block">Checkout other books</a>
            </center>
            `)
            back= false
        }
        else{
            details.forEach(chap=>{
                // console.log(chap);
                addChapter(chap,'Chapters');
            })
            back = true
        }
        return true;
    }
    catch(err){
        console.log(err);
    }
}



/*main function        __
        \\\_|\\   /\  | |  
        \\\_|\\  /_\  | |
        \\   \\ /  \  |_|

*/
        $(document).ready(async ()=>{

         try{
             $('.toast').toast('show',{"data-autohide":false});
            
        const green = await loadBook();
        post_seen();
        setInterval(() => {
            reactions();
            get_seen();
            get_comments();
        }, 1000);
        
        

        const go =await loadChapters(); 
        if(go){
            preventAudioDownload(); 
            
            const buttons = document.querySelectorAll('.chap_btn')
            
        // player stuff

            

            // player stuff
        }
        const chapter = $('#chapter');
        const update = $('#update');
        
        

            if(green){
                prevenImagetDownload();
                
            }


            const mod = await initModal();//start modal
                if(mod){
                    const myModal= $('#myModal');

                }

            //actions
                chapter.on('click',()=>{//new chapter
                    $('.modal-body').html('');
                    postChapter(book,'.modal-body');

                    // call modal
                    $('#myModal').modal('toggle');
                })

                update.on('click',()=>{//update
                    alert('update clicked');
                })

            }
            catch(err){

            }
    


        });







