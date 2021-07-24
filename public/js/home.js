//init


$(document).ready(async ()=>{

    let mod = await initModal();
    if(mod){
        const myModal= $('#myModal');

    }
})
// FilePond.registerPlugin(
//     FilePondPluginImagePreview,
//     FilePondPluginImageResize,
//     FilePondPluginFileEncode
    
// )

// FilePond.setOptions({
// stylePanelAspectRatio:1/1,
// imageResizeTargetWidth:1,
// imageResizeTargetHeight:1
// })

// FilePond.parse(document.body);S

//upload book
var cover;

$('input[type=file]').on('change',function () {
    cover=this.files[0];
    
    // $('#name').text(this.files[0])
})
if(cover){
    console.log(cover);
}

// const bookUp = ()=>{
//     let title = $('title').value;
//     let desc = $('description').value;
//         let form = new FormData();//init form data

//     if(title!=""){//check title
//         form.append("title", title);
//         if(desc!=""){//check desc
//         form.append("description", desc);
//             if(cover!=null){

//                 form.append("cover", fileInput.files[0]);//file cover
//                 return form;
//             }
//             else{
//                 alert('Please select book cover');
//             }
//         }
//         else{
//             alert('Please Provide a description for this book');
//         }



//     }
//     else{
//         alert('Please Provide a title for your book');
//     }
// }


//send new book
// const PostBook = async(book)=>{
//     let response = await fetch({

//     });
// }

    






$('button').on('click',async function(){
    switch ($(this).data("id")) {
        case'cat':
            alert($(this).data("target"));
            
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


//image view
$("input[type=file]").change(function(e) {
var img = document.getElementById("file");
img.attributes('src','');
    for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
        
        var file = e.originalEvent.srcElement.files[i];
        
        
        
        var reader = new FileReader();
        reader.onloadend = ()=>{
             img.src = reader.result;
        }
        reader.readAsDataURL(file);
        $("input").after(img);
    }
    });

 

