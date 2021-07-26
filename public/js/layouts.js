
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
                           <textarea name="description" id="description" cols="30" class="form-control" rows="10"></textarea>
                          </div>
                          <!-- cover image here -->
                          <div class="col-6">
                              <input type="file" name="file" class="form-control"> 
                               <img id="file" class="image_viewer">
                          </div>
                      </div>
      
                     
                      <div class="row">
                          <!-- category / genre -->
                          <div class="col-9">
                          <label for="category">Category</label>
                           <select name="category" id="bookcategory" multiple="multiple" style="width: 100%" class="form-control"  >
                          
                           </select>
                           <label for="author">Author(s)</label>
                           <input name="author" class="form-control" title="Note:Seperate authors with a '-' eg. Osei Tutu - Asabere" placeholder="eg. Osei Tutu - Asabere">
                          </div>
                          <div class="col-3">
                              <div class="row">
                                  <div class="col-6"><button type="reset" id="genBtn"  class="btn btn-warning">Cancel</button></div>
                                  <div class="col-6"><button type="submit" id="genBtn" data-id="newBook" class="btn btn-primary">Post</button></div>
                           </div>
                             
                          </div>
                      </div>
      
                 </div>
               </form>`)
            
                
            
}
/*
  
*/


/*  
<span class="badge badge-light">9</span>
<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           Dropdown

         </a>
         <div class="dropdown-menu" aria-labelledby="navbarDropdown">
           <a class="dropdown-item" href="#">Action</a>
           <a class="dropdown-item" href="#">Another action</a>
           <div class="dropdown-divider"></div>
           <a class="dropdown-item" href="#">Something else here</a>
<div class="chip">
  <img src="img_avatar.jpg" alt="Person" width="96" height="96">
  John Doe
</div>
        </div>
*/ 





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
const category=(cat_name,location='category')=>{
    let loc= $('#'+location);

    loc.append(
        $('<button/>',{'type':'button','class':'button cat ','id':'genBtn','data-id':'cat','data-target':cat_name}).append(cat_name)
    );

}



// for trial sake, shouldn't accept arguements
// navbar('me.jpg');