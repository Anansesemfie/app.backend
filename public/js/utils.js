

const getCategory = async ()=>{
try{
        let result = await fetch("http://localhost:4000/category/");

        let data = await result.json();
        // console.log(data.categories);
        
        return data.categories;
        
       

}
catch(err){

}
  
}