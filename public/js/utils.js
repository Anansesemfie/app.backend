

const getCategory = async ()=>{
try{
        let result = await fetch("/category/");

        let data = await result.json();
        // console.log(data.categories);
        
        return data.categories;
        
       

}
catch(err){
        alert(`Attention, Connection to server broke\n check your internet connection `)

}
  
}