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
    click for a more precise filtering
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
        
        const searchButton = $('#searchBtn');//get search button element
        searchButton.on('click',()=>{//when search button is clicked
            console.log('Btn clicked');
            const keyword = $('#searchSpace').val();
            searching(keyword);

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