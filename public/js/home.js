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
        alert(err)
    }
     
}

const Books = async()=>{
    let book = await getBooks();
    if(!book){
  _book.append($('<img/>',{'src':'/images/logo_d.png'}));

    }
    book.forEach(story=>{
        ad_card(story,'top_books');
    });

}

//init

$(document).ready(async ()=>{
    try{

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
                        console.log(bookTails);
                
                        break;
                        case 'bookForm':
                            
                            $('.modal-body').html('');
                            bookForm('.modal-body');
                
                            
                
                            //multiselect
                            $('select').select2({
                                theme: 'classic',
                                placeholder: 'Select category',
                                maximumSelectionLength: 4
                            });
                
                            
                            //init category
                            let cat = await getCategory();
                            cat.forEach(cate => {
                               var newOption = new Option(cate.title[0], cate.title[0], false, false);
                            $('Select').append(newOption).trigger('change');
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
                
                }).on('mouseover',()=>{
                
                })

    }
    catch(err){
        alert(err);
    }
    
   
})












 

