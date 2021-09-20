const cate_field = $('#category');
const played_field = $('#played');
const filtBtn = $('#filterBtn');


const filter = async()=>{
    try{
        // console.log(butt);
        let category =cate_field.val();
        let played=played_field.val()
        if(!category){
            category="";
        }
        if(!played){
            played=0;
        }
        const data = {
            category,
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

$(document).ready(async ()=>{
    try{
        // console.log('hello');
        toastHolder(); // toast holder
       $('.toast').toast('show');
        $('#books').html('');
        let cat = await getCategory();
        // console.log(cat);
        cat.forEach(cat => {
            // console.log(cat.title[0]);
           cate_field.append($('<option/>',{'value':cat.title[0]}).append(cat.title[0]));                   
         });

         $('#filterBtn').on('click',async ()=>{
            //  alert('hello');
            let filt = await filter();
         });
    }
    catch(error){
         toast({message:error,title:'Trouble with user',bg:'bg-danger'});
    
    }
})

