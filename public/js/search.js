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
    const searchArea = $("<div type=text id='searchArea' class='card searchArea'>");
    if(!searchArea){
        throw `Couldn't pull search field`;
    }
    searchArea.append(`
    <div class="card-footer">
    <a href="/filter">
    click for a more precise filtering
    </a>
    </div>
    
    `);

    $('.search').append(searchArea);
    return true;
}


$(document).ready(async ()=>{
    try{
       if(newSearch()){//search field created
        const search = $('#searchSpace');

        search.on('click',()=>{
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


    }
    else{
        throw 'Problem initializing search';
    } 
    }
    catch(error){
        toast({message:error,title:'Could not retrieve comments',bg:'bg-warning'});
    }
    
});