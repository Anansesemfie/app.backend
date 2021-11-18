const link =window.location.href;
const params = link.split('/');

const fstParam =params[4];
const lstParam =params[5];

console.log(fstParam,lstParam);


const cate_field = $('#category');
const lang_field = $('#langs');
const played_field = $('#played');
const filtBtn = $('#filterBtn');


const filter = async()=>{
    try{
        // console.log(butt);
        let category =cate_field.val();
        let language = lang_field.val();
        let played=played_field.val()
        
        if(!category){
            category="";
        }
        if(!language){
            language="";
        }
        if(!played){
            played=0;
        }

        const data = {
            category,
            language,
            played
        }
        const filtering = await Filter(data);
        let i=0;
        do {
           if($('#books').html('')){// clear div for loading feed back
               $('#books').html(`<img src="/images/loading.gif" alt="loading gif">`); 
           };
          
        } while (!filtering.filtered);
        // console.log(filtering.filtered.length);
        if(filtering.filtered.length<1){
            
        }
        if($('#books').html('')){//clear and check div has been emptied
            filtering.filtered.forEach(bk=> {
            // console.log(bk);
            ad_card(bk,'books');
        });
        }
        

        
        

    }
    catch(error){
        throw error
    }
}

//expandFilter

const expand =async ()=>{
    try{
        const exp = await expandFilter(fstParam,lstParam);
        if(!exp){
            throw 'Something else happened';
        }

        if($('#books').html('')){//clear and check div has been emptied
            exp.books.forEach(bk=> {
            // console.log(bk);
            ad_card(bk,'books');
        });
        }

    }
    catch(error){
        throw error;
    }
}



$(document).ready(async ()=>{
    try{
        // console.log('hello');
        toastHolder(); // toast holder
       $('.toast').toast('show');
        $('#books').html('');
        loadCategory();
        loadLangs();
        // console.log(cat);
        if(fstParam && lstParam){
            let expd=await expand();
        }
       
        Events();

        
    }
    catch(error){
         toast({message:error,title:'Trouble with user',bg:'bg-danger'});
    
    }
})


const loadCategory =async ()=>{
    try{
      let cat = await getCategory();
    // cate_field.html('');
    cat.forEach(cat => {
        // console.log(cat.title[0]);
       cate_field.append($('<option/>',{'value':cat.title[0]}).append(cat.title[0]));                   
     });  
    }
    catch(error){
        throw error;
    }
    
}
const loadLangs =async ()=>{
    try{
      let lang = await getLanguages();
    // console.log(lang.title);
    lang.forEach(lang => {
        // console.log(cat.title[0]);
       lang_field.append($('<option/>',{'value':lang.title[0]}).append(lang.title[0]));                   
     });  
    }
    catch(error){
        throw error;
    }
    
}

const Events =()=>{
    try{
        $('#filterBtn').on('click',async ()=>{
            //  alert('hello');
            let filt = await filter();
         });

    }
    catch(error){
        throw error
    }
}
