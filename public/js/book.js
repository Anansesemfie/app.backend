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

    //fill the blanks
    cover.attr('src',details.bookBack.cover);
    title.text(details.bookBack.title);
    description.text(details.bookBack.description);

    if(details.creator){
        ifUser.append(
           
            $('<button/>',{'class':'button btn cat signin','id':'chapter'}).append('Add Chapter'),
            $('<button/>',{'class':'button btn cat signin','id':'update'}).append('Update')
        )
    }

    details.bookBack.category.forEach(cat => {
        addCategory(cat,'category');
    });
    }
    catch(err){
        console.log(err);
    }



}

//main function
        $(document).ready(async ()=>{

         try{
        const green = await loadBook();
        const chapter = $('#chapter');
        const update = $('#update');

            if(green){
                console.log('fetching chapters');
            }

            //actions
                chapter.on('click',()=>{//new chapter
                    alert('chapter clicked');
                })

                update.on('click',()=>{//update
                    alert('update clicked');
                })

            }
            catch(err){

            }
    


        });







