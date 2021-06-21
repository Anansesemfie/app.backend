const nav= $('#nav_bar');

function navbar(dp){
  dp='images/'+dp;
   nav.append(
      $('<nav/>', {'class': 'navbar navbar-light fixed-top bg-light'}).append(
          $('<a/>', {'class': 'navbar-brand','href':'#'}).append(
              $('<img/>', {'src': 'images/cj_trans_2.png','width':30,'height':30})
          ),
          $('<a/>',{'class':'nav-link dropdown-toggle user_nav','id':'navbarDropdown', 'role':'button','data-toggle':'dropdown','aria-haspopup':'true','aria-expanded':'false'}).append(
            $('<div/>',{'class':'chip'}).append($('<img/>',{'alt':'username','width':'50','height':'50','src':dp}))
          ),
          $('<div/>',{'class':'dropdown-menu','aria-labelledby':'navbarDropdown'}).append(
              $('<a/>',{'class':'dropdown-item'}).append('Profile'),
              $('<a/>',{'class':'dropdown-item'}).append('Settings'),
              $('<a/>',{'class':'dropdown-item'}).append('Events').append($('<span/>',{'class':'badge badge-primary'}).append(/*upcoming*/'4')),
              $('<a/>',{'class':'dropdown-item'}).append('Logout')
          )
      
      )
  );


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
function category(cat_name,location){
    let loc= $('#'+location);

    loc.append(
        $('<button/>',{'type':'button','class':'button cat','value':cat_name}).append(cat_name)
    );

}



// for trial sake, shouldn't accept arguements
// navbar('me.jpg');