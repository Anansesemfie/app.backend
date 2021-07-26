

const getCategory = async ()=>{
try{
        let result = await fetch("/category/");

        let data = await result.json();
        // console.log(data.categories);
        
        return data.categories;
        
       

}
catch(err){
        alert(`Attention, we couldn't retrieve the Categories\n check your internet connect `)

}
  
}