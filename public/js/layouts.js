
//   <!-- Modal -->



const initModal = async ()=>{
    let position= $('body');
    position.append(`<div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" aria-hidden="true">
           <div class="modal-dialog modal-lg">
             <div class="modal-content">
               <div class="modal-header headerColor">
                 <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
               </div>
             <div class="modal-body">
                   
                
    </div>
             
     </div>
     </div>
     </div>`)
}
     
const bookForm = async (loc)=>{
    let position = $(loc);
    //init category


    position.append(`<form action="/book/upload" enctype="multipart/form-data" method="POST">
                       <div class="container">
                      <div class="row">
                          <!-- title and description -->
                          <div class="col-6">
                              <label for="title">Title</label>
                           <input type="text"  name="title" id="title" class="form-control" required placeholder="Title">
                           <label for="description">Description</label>
                           <textarea name="description" id="description" cols="30" maxlength=1000 class="form-control" rows="10"></textarea>
                          </div>
                          <!-- cover image here -->
                          <div class="col-6">
                          <img id="file" class="image_viewer">
                              <input type="file" name="file" class="form-control"> 
                               
                          </div>
                      </div>
      
                     
                      <div class="row">
                          <!-- category / genre -->
                          <div class="col-12">
                          <label for="category">Category</label>
                           <select name="category" id="bookcategory" multiple="multiple" style="width: 100%" class="form-control"  >
                          
                           </select>
                           <label for="author">Author(s)</label>
                           <input name="author" class="form-control" title="Note:Seperate authors with a '-' eg. Osei Tutu - Asabere" placeholder="eg. Osei Tutu - Asabere">
                          </div>
                          
                      </div>
                      <div class="row">
                                  <div class="col-6"><button type="reset" id="genBtn"  class="btn btn-warning btn-block">Cancel</button></div>
                                  <div class="col-6"><button type="submit" id="genBtn" data-id="newBook" class="btn btn-primary btn-block">Post</button></div>
                           </div>
      
                 </div>
               </form>`)
            
                
            
}


const bookDetail = (detail,loc=".book")=>{
    let position = $(loc);

    position.append(`
    <div class="row">
    <div class="col-6">
        <!-- cover -->
        <img src="${detail.cover}" alt="" id="file" class="book_img">
        
    </div>
    <div class="col-6">
        <!-- details -->
                <div class="book_title">
                    ${detail.title}
                </div>
                <hr>
                <div class="container centered" id="bookCategory">
                    ${detail.category.forEach(cate=>{ 
                        console.log(cate)
                        addCategory(cate,'bookCategory')})}
                </div>
                <hr>
                <div class="book_para">
                    <p id="description">
                    ${detail.description}
                    </p>
                </div>

                <div class="row">
            <!-- reaction -->
            <div class="col-4 ">
                <button type="button" class="">
                    Liked<span class="badge book_count" id="liked">${detail.liked}</span>
                  </button>
            </div>
            <div class="col-4">
                <button type="button" class="">
                    Disliked<span class="badge book_count" id="disliked">${detail.disliked}</span>
                  </button>
            </div>
            
            <div class="col-4">
                <button type="button" class="">
                    Listened<span class="badge book_count" id="seen"></span>
                  </button>
            </div>
            </div>
    </div>
        

        </div>
    
    
    `);
}

//card

function ad_card(ad_img,ad_id,location){
    let loc= $('#'+location);
    ad_img='images/'+ad_img;

    loc.append(
        $('<div/>',{'class':'col mb-4'}).append(
            $('<div/>',{'class':'card'}).append(
                $('<img/>',{'class':'card-img-top','alt':'webinar banner','src':ad_img}),
                $('<div/>',{'class':'card-body'}).append(
                $('<div/>',{'class':'container'}).append(
                $('<div/>').append(
                $('<button/>',{'class':'button','id':'signupBTN','value':ad_id}).append($('<i/>',{'class':'fa fa-calendar-plus-o','aria-hidden':'true'})),
                $('<button/>',{'class':'button','id':'peekBTN','value':ad_id}).append($('<i/>',{'class':'fa fa-expand','aria-hidden':'true'})),
                $('<button/>',{'class':'button','id':'enterBTN','value':ad_id}).append($('<i/>',{'class':'fa fa-sign-in','aria-hidden':'true'}))
                )
                )
                )
            )
        )

    );
  
}

//category
const addCategory=(cat_name,location='category')=>{
    let loc= $('#'+location);

    loc.append(
        $('<a/>',{'href':'/category/'+cat_name,'type':'button','class':'button cat ','id':'genBtn','data-id':'cat','data-target':cat_name}).append(cat_name)
    );

}


const addBarner = (book,loc)=>{
    let position = $(loc);

    position.append(`
    <div id="carouselExampleFade" class="carousel slide carousel-fade" data-ride="carousel">
      <div class="carousel-inner">

        <div class="carousel-item active">
          <div class="ig_container " id="biggerPicture">
              <img src="" alt="" id="bookCover">


          </div>
          <div class="top-top">
            
         <div class="pic_heading">
           <span id="bookTitle"></span>
           <span id="ifUser">
           <button  type="button" id="genBtn" data-id="bookForm" class="button btn cat signin">Add Book</button>
           </span>
            
            
         </div>

       </div>


        <div class="container centered" id="category">
          
        </div>
        <div class="container bottom-left" id="react">
         
        </div>

</div>
        
       
        
       


      </div>
    </div>
    `);
}



//functions
const toBase64 = async (data)=>{//convert buffer to base64
    try{
         let mime = data.mimetype;
    let buffer = btoa(data.buffer);
        console.log(buffer);
    let cover = `data:${mime};base64,${buffer}`;

    return cover;
    }
    catch(err){
        alert(err);
    }
   
   
}

// function _arrayBufferToBase64( buffer ) {
//     var binary = '';
//     var bytes = new Uint8Array(buffer);
//     var len = bytes.byteLength;
//     for (var i = 0; i < len; i++) {
//         console.log(bytes[i]);
//         binary += String.fromCharCode( bytes[ i ] );
//     }
//     return btoa( binary );
// }

function str2ab(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
   
  }

const handleError = (err)=>{
    console.log(err);
}