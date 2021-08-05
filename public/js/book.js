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
const liked = $('.liked');
const disliked = $('.disliked');

//stats
const seen = $('.seen');


const loadBook = async ()=>{
    try{
        let details = await getBookdetails(book);
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


const loadChapters = async () =>{
    try{
       
        let details = await getChapters(book);
        //  console.log('in load',details);
        if(details.length==0){
            $('#Chapters').append(`
            <center>
            <a href="/" class="button cat btn-lg btn-block">Checkout other books</a>
            </center>
            `)
        }
        else{
            details.forEach(chap=>{
                console.log(chap);
                addChapter(chap,'Chapters');
            })
        }

    }
    catch(err){
        console.log(err);
    }
}

//main function
        $(document).ready(async ()=>{

         try{
             $('.toast').toast('show',{"data-autohide":false});
            
        const green = await loadBook();
        const go =loadChapters(); 
        if(go){
            preventAudioDownload(); 
        }
        const chapter = $('#chapter');
        const update = $('#update');

            if(green){
                prevenImagetDownload();
                
            }


            let mod = await initModal();//start modal
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







