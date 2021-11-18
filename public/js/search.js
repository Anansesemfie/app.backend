

const newSearch = ()=>{
    try{
        const search = $("<div   class=search>");
        if(!search){
            throw `Couldn't pull search field`;
        }
        const searchSpace =$("<input type=text id='searchSpace' placeholder='Search'>");
        const searchBtn =$("<button  id='searchBtn'>");
        searchBtn.append(`<i class="fas fa-search"></i>`);

        search.append(searchSpace,searchBtn);

        $('body').append(search);
        return true;

    }
    catch(error){
        toast({message:error,title:'Searching issue',bg:'bg-warning'});
    }
    
}

const searchResult = ()=>{
    const searchAreas = document.querySelectorAll('.searchArea');
    if(searchAreas){
        searchAreas.forEach(ele=>{
            ele.remove();
        })
    }
    const searchArea = $("<div id='searchArea' class='card searchArea'>");
    if(!searchArea){
        throw `Couldn't pull search field`;
    }
    searchArea.append(`
    <div class="card-footer">
    <a href="/filter">
    <i class="fas fa-filter"></i>click for more filtering
    </a>
    </div>
    
    `,`<div id="searchBody"></div>`);

    $('.search').append(searchArea);
    return true;
}


$(document).ready(async ()=>{
    try{
       if(newSearch()){//search field created
        const search = $('#searchSpace');//get search space element
       

        search.on('click',()=>{//when search space is clicked or not 
            searchResult();

            $(document).mouseup(function(e){
                var container = $('.search');

                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) 
                    {
                        $('.searchArea').css('display','none')
                    }
        });
            
            
        });
        
        document.getElementById("searchSpace").addEventListener("keypress", async (event) => {//search by enter
            if (event.key=="Enter"||event.code== 13 ||event.code=="Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                if(screen.width<=760){
                    const keyword = $('#searchSpace').val();
                    let state = await searching(keyword);
                if(!state){
                    $(this).css('background-color','brown');
                }
                else{
                    throw 'Nothing found';
                }
                }

                document.getElementById("searchBtn").click();//not mobile

                
            }
        });

        
        const searchButton = $('#searchBtn');//get search button element
        searchButton.on('click',()=>{//when search button is clicked
            console.log('Btn clicked');
            const keyword = $('#searchSpace').val();
            searching(keyword);
            toolTips();

        });



    }
    else{
        throw 'Problem initializing search';
    } 
    }
    catch(error){
        toast({message:error,title:'Could not retrieve comments',bg:'bg-warning'});
    }
    
});




//function to search 
const searching = async (keyword)=>{
    try{
        const results = await search(keyword);
        
        if(!results){
            throw 'Wow what could this be';
        }
        $('#searchBody').html('');
        results.books.forEach(bk=>{
            searchDiv('searchBody',bk);
        })
        
    
    }
    catch(error){
        
        toast({message:error,title:'Error While searching',bg:'bg-warning'});
    }
}

const toolTips = ()=>{
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

}