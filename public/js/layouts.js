
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

const passStrenght = (pass)=>{
    const reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    return reg.test(pass);


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
    let category ="No"

    if(book.category.length>0){
    category=book.category[0];
      book.category.forEach(ele=>{
        categories+=ele+',';
    })

    }
    

    loc.append(
        `
    <div class="col mb-4 parentDiv">
        <div class="ig_container jstBook">
            <img src="${book.cover}" alt="${book.title}">


        </div>
        <div class="delBook">

          <div class="top-top">
          <!-- book info -->
          <h3>#${book.title}</h3><br>
          Part of <span title="${categories}">${category}</span> category<br>
          Played <span>${book.played}</span> times
        </div>

        <div class="bottom-left">
          <!-- peek btn -->
          <!--<button  class="btn btn-outline-primary btn-lg" id="peekBTN" data-target="${book._id}"><i class="fas fa-expand"></i>Peek</button> -->
        </div>

        <div class="bottom-right"><!-- used to be bottom-right and btn-lg-->
          <a class="btn btn-outline-info btn-lg" href="/book/Read/${book._id}"><i class="fas fa-door-open"></i>Open</a>
        </div>

        </div>
        


      </div>

    `


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
        $('<a/>',{'href':'/filter/category/'+cat_name,'type':'button','class':'button cat ','id':'genBtn','data-id':'cat','data-target':cat_name}).append(cat_name)
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
       <img src="${msg_details.dp}"  class="msg-img" alt="${msg_details.username} dp">
      </a>

      <div class="msg-bubble">
        <div class="msg-info">
          <a href="/user/profile/${msg_details.user}" class="msg-info-name">${msg_details.username}</a>
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
    <div role="alert" aria-live="assertive" aria-atomic="true" onload="attemptClose(this)" class="toast ${msg.bg}" data-bs-autohide="false">
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

const attemptClose=(e)=>{
    setTimeout(() => {
        e.style.display = 'none';
    }, 4000);
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

 //user 
 const userForm=(loc)=>{
     
    try{
const position = $(`${loc}`);
     position.append(`
     
                  
                  
     <div class=" form-floating mb-3">
     <h3>Profile Details </h3>
         <form action="/user/update" enctype="multipart/form-data" method="POST">
       
       <input type="file" name="dp_cover" class="form-control">
       <label for="userName">Profile Photo</label><br>
       <hr>
       
          <div class="username error"></div>
       <input type="Text" name="username" id="Uname" class="form-control" placeholder="User Name" title="Changing username wiil make it difficult for your audience to locate you">
       <label for="userName">User Name</label><br>
       <hr>
       
       <textarea name="bio" id="Ubio" class="form-control" placeholder="biograph" >

       </textarea>
       <label for="bio">Biograph</label><br>

       <button type="submit" class="cat cat_green" >Update Profile</button>
       <div class="status error"></div>
        </form>
     </div>
    
   
 
      <div class=" form-floating mb-3" id="userLog" style=" display: none;
      transition: cubic-bezier(0.175, 0.885, 0.32, 1.275);">
      <h3>Login Details </h3>
      <!-- password_1 -->
      <div class=" form-floating mb-3">
          <div class="password error"></div>
        <input type="password" name="password" class="form-control" id="pass_1" placeholder="New Password" required="required">
        <label for="password">New Password</label>
        <div style="float:right;"><input type="checkbox" id="shwPass" value="">Show Password</div>
        
    </div>

    <!-- password_2 -->
    <div class=" form-floating mb-3">
        <div class="password error"></div>
      <input type="password" name="password" id="pass_2" class="form-control" placeholder="confirm Password" required="required">
      <label for="password">Confirm Password</label>
      
  </div>
   <button type="button" class="cat cat_green" id="updateInfo" >Update Password</button>
   <div class="status error"></div>

      </div>
      

       <!--login details -->

 <label class="label">
     <div class="toggle">
       <input class="toggle-state" type="checkbox" id="logDetails" name="check" value="check" />
       <div class="indicator"></div>
     </div>
     <div class="label-text">Edit Login details</div>
   </label>
     `);
    }
    catch(error){
        if(!error){
            error="Couldn't bring update form";
        }
        throw error;
    }
 }

 const forgotForm = (loc)=>{

    const position = $(`${loc}`);
     position.append(`
     <div class=" form-floating mb-3">
     <h3>Reset Password </h3>
     <label for="email">Email</label><br>
     <input type="Text" name="email" id="forgot_email" class="form-control" placeholder="Enter the Email for loggining into your account" title="Changing username wiil make it difficult for your audience to locate you">
     <div class="error" id="fgtEmail_error"></div>
     <hr>
     

     <button type="submit" id="proceed_fgt" class="cat cat_green" >Proceed</button>
     </div>
     `);
 }  


 const addSubscription = (loc)=>{
        const position = $(`${loc}`);
     position.append(`
     
  <div class="col">
    <div class="card">
      <img src="..." class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      </div>
    </div>
  </div>
     `);
 }