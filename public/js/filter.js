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
        // let i=0;
        // do {
        //     console.log(i);
        //     i++;
        // } while (!filtering);
        
        filtering.forEach(book=> {
            console.log(book);
            ad_card(book,'books');
        });

        
        

    }
    catch(error){
        
    }
}

$(document).ready(async ()=>{
    try{
        console.log('hello');
        let cat = await getCategory();
        console.log(cat);
        cat.forEach(cat => {
            // console.log(cat.title[0]);
           cate_field.append($('<option/>',{'value':cat.title[0]}).append(cat.title[0]));                   
         });

         $('#filterBtn').on('click',async ()=>{
            //  alert('hello');
            await filter();
         });
    }
    catch(error){
        console.log(error);
    }
})

