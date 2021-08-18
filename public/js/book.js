const link =window.location.href;
const params = link.split('/');

const action=params[4];
const book = params[5];

//check cookies



//page elements
const cover = $('#bookCover');
const title = $('#bookTitle');
const description = $('#description');
const ifUser = $('#ifUser');
const comment = $('#comment');



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
        toast({message:err,title:'Could not get books',bg:'bg-warning'});
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
        toast({message:err,title:'Could not post seen',bg:'bg-warning'});
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
        toast({message:err,title:'could not get seen',bg:'bg-warning'});
    }
    
}



const get_comments = async ()=>{//get all comments
    try {
        const coms = await getComments(book);
        if(coms){
            $('#comments').text('');
            coms.comments.forEach(comet=>{
                let msg ={
                    dp:comet.commenter[0].dp,
                    username:comet.commenter[0].username,
                    time:comet.moment,
                    comment:comet.comment
                }

                addCommentOut('comments',msg);

                // console.log(msg);
            })

        }
        else{


        }
    } 
    catch (error) {
        toast({message:error,title:'Could not retrieve comments',bg:'bg-warning'});
    }

}

const post_comment = async()=>{
    try {
        let msg = comment.val();
        console.log(msg);
        if(!msg){
            throw 'Type something first'
        }
        let comment_gone = await postComment(book,msg);
        if(!comment_gone){
            alert('Comment did not go through!');
            return false
        }
        else{
            comment.val('');
            return true;
        }

        
    } catch (error) {
        let msg = error;
        console.log(msg);
        toast({message:msg,title:'Comment Problem',bg:'bg-warning'});
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


//On Page conditions





//On page conditions


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
        }, 5000);
        
        $('#comment_go').on('click',async ()=>{
            let state = await post_comment();
            if(!state){
                $(this).css('background-color','brown');
            }
            else{
                $(this).css('background-color','green')
            }

        });

       toastHolder(); // toast holder
       $('.toast').toast('show');

        const go =await loadChapters(); 
        if(go){
            preventAudioDownload(); 
            
            const buttons = document.querySelectorAll('.chap_btn')

            buttons.forEach(ele=>{
                console.log(ele);
                ele.on('click',()=>{
                    alert('come on');
                });
            })
            
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







