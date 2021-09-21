
//   <!-- Modal -->
const handleError = (err)=>{
    console.log(err);
}


const prevenImagetDownload = ()=>{
    let image = document.querySelectorAll('img');

    image.forEach(ele=>{
        ele.addEventListener('contextmenu',(e)=>{
            e.preventDefault();
            });
            
    })
}
const preventAudioDownload = ()=>{
    let aud = document.querySelectorAll('audio');

    aud.forEach(ele=>{
        ele.addEventListener('click',(e)=>{
            alert(e);
            });
            console.log('disabled');
    });

}


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
                           <input type="text"  name="title" id="title" maxlength=50 class="form-control" required placeholder="Title">
                           <label for="description">Description</label>
                           <textarea name="description" id="description" cols="30" maxlength=1000 class="form-control" rows="10"></textarea>
                          </div>
                          <!-- cover image here -->
                          <div class="col-6">
                              <input type="file" name="file" class="form-control"> 
                               <img id="file" class="image_viewer">
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

const postChapter = (id,loc)=>{
    let position = $(loc);

    position.append(`
    <form action="/chapter/upload" enctype="multipart/form-data" method="POST">
        <input type="text" name="book" value="${id}" hidden=true/>
                       <div class="container">
                      <div class="row">
                      <div class="col-6">
                      <label for="title">Chapter Title</label>
                   <input type="text"  name="title" id="title" maxlength=50 class="form-control" required placeholder="Title">
                  </div>
                  <div class="col-6">
                      <label for="title">Audio File</label>
                   <input type="file"  name="file"  class="form-control" required>
                  </div>

                      </div>

                      <div class="row">
                        <div class="col-12">
                <label for="description">Chapter Description</label>
                <textarea name="description" id="description" cols="30" maxlength=100 class="form-control" rows="10"></textarea>
                        </div>
                      </div>

                      <div class="row">
                                  <div class="col-6"><button type="reset" id="genBtn"  class="btn btn-warning btn-block">Cancel</button></div>
                                  <div class="col-6"><button type="submit" id="genBtn" data-id="newBook" class="btn btn-info btn-block">Post</button></div>
                           </div>

                      </div>

                      </form>
    `);
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

function ad_card(book,location){
    let loc= $('#'+location);
    let categories="";

    book.category.forEach(ele=>{
        categories+=ele+' ';
    })

    loc.append(
        $('<div/>',{'class':'col mb-4'}).append(
            $('<div/>',{'class':'card'}).append(
                $('<img/>',{'class':'card-img-top proper_img','alt':`${book.title}`,'src':book.cover}),
                $('<div/>',{'class':'card-body'}).append(
                $('<div/>',{'class':'card-title','style':'font-family: fantasy;'}).append(`#${book.title}`),
                $('<div/>',{'style':'font-weight:bolder','class':'p-4 rounded shadow-sm bg-light'}).append($('<div/>').append(categories),$('<div/>').append('<i class="fas fa-headphones"></i>',book.played)),
                $('<div/>',{'class':'container'}).append(
                $('<div/>').append(
                $('<button/>',{'class':'button','id':'peekBTN','data-target':book._id}).append($('<i/>',{'class':'fas fa-window-maximize','aria-hidden':'true'})),
                $('<a/>',{'class':'button','id':'enterBTN','href':`/book/Read/${book._id}`}).append($('<i/>',{'class':'fas fa-door-open','aria-hidden':'true'}))
                )
                )
                )
            )
        )

    );
  
}




const addAuthor = (name,loc)=>{
    let position = $(`#${loc}`);

    position.append(
        `<a href="#">
        <h5 class=" badge bg-dark text-light">${name}</h5>
        </a> `
    )
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

const addCommentIN = ()=>{
    let position = $('body');

    position.append(`
    <div id="commenting" class="floatingDiv mobile">
          <!-- comment input here -->
          <input type="text" name="" id="comment" class="myInput" placeholder="leave a comment">
          <button class="btn btn-info">>></button>
        </div>
    `);
}

const addCommentOut = (loc,msg_details)=>{
    let position = $(`#${loc}`);
    // console.log(msg_details);

    position.append(`

    <div class="msg left-msg">
      <a href="/user/profile/${msg_details.user}">
       <img src="/images/${msg_details.dp}"  class="msg-img" alt="${msg_details.username}">
      </a>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${msg_details.username}</div>
          <div class="msg-info-time">${msg_details.time}</div>
        </div>

        <div class="msg-text">
         ${msg_details.comment}
        </div>
      </div>
    </div>
    <hr>

    `);

}





//functions
const addChapter = (data,loc)=>{
    let position = $(`#${loc}`);
    position.append(`
    <div class="col mb-4 chapter">
                <div class="card">
                  
                  <div class="card-body">
                  <div class="col-12">
                  
                  <div class="card-title" title="">#${data.title}</div>
                  <hr>
                  
                  ${data.description}
                 
                  </div>
                    
                  </div>
                  <button  class="btn cat chap_btn" data-id="chapter" data-target="${data._id}">
                  <div class="card-footer">Play</div>
                  </button>
                </div>
              </div>
    `);
}





//Error and feedback handling

//toasts holder
const toastHolder = ()=>{
    $('body').append(`
    <!-- notifications -->
    <div class="floatingDivToasts" id="toasting">

      

    </div>
    `);
}

//toasts
const toast = (msg)=>{
    // console.log(msg.bg)
    $('#toasting').append(`
    <div role="alert" aria-live="assertive" aria-atomic="true" class="toast ${msg.bg}" data-bs-autohide="false">
    <div class="toast-header">
     
      <strong class="me-auto">${msg.title}</strong>
      
      <button type="button" class="btn btn-light" id="closeToast" onclick="closeToast(this)">X</button>
    </div>
    <div class="toast-body">
      ${msg.message}
    </div>
  </div>

    `);
}
const closeToast = (e)=>{
    e.parentElement.parentElement.style.display='none';
}

const signUp=()=>{
    let ref = window.location.href;
    // let parts = ref.split('/');
    // // alert(parts);
    // let newLink="";
    // for(let i = 3; i<=parts.length-1;i++){
    //     alert(i);
    //     newLink+=`/${parts[i]}`;

    // }
    // alert(ref);

    window.location.href=`/user?redirect=${ref}`;
}

const myUrl = ()=>{
    const link =window.location.href;
    const params = link.split('/');

    let url= `${params[0]}//${params[2]}`;

    return url;
}

const searchDiv = (loc,data)=>{
    let position = $(`#${loc}`);
    // console.log(msg_details);

    position.append(`

    <div class="" style="width:18rem;" title="${data.description}">
    <div class="card-header row">

    <img src="${data.cover}">
    ${data.title}
    </div>
    <div class="card-body">
    <div class="row">Categories:${data.category} </div>
    <div class="row">Played:${data.played} </div>
    <a href="/book/Read/${data._id}" class="btn btn-outline-dark"><i class="fas fa-door-open"></i></a>
    </div>

    </div>
    
    <hr>

    `);
}