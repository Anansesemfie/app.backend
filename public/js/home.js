const _book = $('#top_books');

const categories = async ()=>{//get all categories
    try{
        // init category
            let cat = await getCategory();
            cat.forEach(cate => {
        addCategory(cate.title[0]);
        });
    }
    catch(err){
        toast({message:err,title:'Could not categories',bg:'bg-warning'});
    }
     
}

const Books = async()=>{
    let book = await getBooks();
    if(!book){
  _book.append($('<img/>',{'src':'/images/logo_d.png'}));
  throw `Couldn't get books, check connection`;
    }
    // console.log(book);
    _book.html('');

    book.forEach(story=>{
        // console.log(story);
        ad_card(story,'top_books');
    });

}

//init

$(document).ready(async ()=>{
    try{
        toastHolder(); // toast holder
                let mod = await initModal();
                if(mod){
                    const myModal= $('#myModal');

                }
                $('.toast').toast('show');
                
                categories();//init categories
                if(Books()){
                    prevenImagetDownload();
                }
                



                //activities Switch statement
                $('button').on('click',async function(){
                    switch ($(this).data("id")) {
                        case'cat':
                            alert("any");
                            
                            break;
                        case 'bookBtn':
                            alert($(this).data("target"));
                        break;
                
                        case 'newBook':
                        let bookTails = bookUp();
                        // console.log(bookTails);
                
                        break;
                        case 'bookForm':
                            
                            $('.modal-body').html('');
                            bookForm('.modal-body');
                
                            
                
                            //multiselect
                            $('#bookcategory').select2({
                                theme: 'classic',
                                placeholder: 'Select category',
                                maximumSelectionLength: 4
                            });
                
                            
                            //init category
                            let cat = await getCategory();
                            cat.forEach(cate => {
                               var newOption = new Option(cate.title[0], cate.title[0], false, false);
                            $('#bookcategory').append(newOption).trigger('change');
                            });
                            
                            //multiple languages
                            $('#bookLangs').select2({
                                theme: 'classic',
                                placeholder: 'Select category',
                                maximumSelectionLength: 4
                            });
                            
                            //init languages
                            let lang = await getLanguages();
                            lang.forEach(cate => {
                               var newOption = new Option(cate.title[0], cate.title[0], false, false);
                            $('#bookLangs').append(newOption).trigger('change');
                            });

                            //Owner
                            $('#bookOwner').select2({
                                theme: 'classic',
                                placeholder: 'Select Owner',
                                maximumSelectionLength: 1,
                                templateResult: selectImage,
                                templateSelection: selectImage
                            });
                            
                            //init owner
                            let owners = await getOwners();
                            console.log(typeof owners);
                                owners.forEach(own => {
                                    console.log(own._id,own.username);
                                // let show = `<img src="${own.dp}" class="msg-img"/>${own.username}`;
                               var newOption = new Option(own.username,own._id, false, false,own.dp);
                                $('#bookOwner').append(newOption).trigger('change');
                            });
                
                            
                
                            //image view
                $("input[type=file]").change(function(e) {
                    console.log('something')
                
                    // img.attributes('src','');
                    // img.remove();
                    for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
                        var img = document.getElementById("file");
                        var file = e.originalEvent.srcElement.files[i];
                        
                        
                        
                        var reader = new FileReader();
                        reader.onloadend = ()=>{
                             img.src = reader.result;
                        }
                        reader.readAsDataURL(file);
                        $("input").after(img);
                    }
                    });
                
                                // alert('bookform');
                                $('#myModal').modal('toggle');
                            
                            
                            break;
                        case 'user':
                        location.href='/user/';
                        break;
                    
                        default:
                            alert('This action is not recognized');
                            break;
                    }
                
                })
                // .on('mouseover',(e)=>{
                // e.attributes('disabled').css('background-color', 'grey');
                
                // })

    }
    catch(err){
        
        toast({message:err,title:'Could not get books',bg:'bg-warning'});
    }
    
   
})












 

