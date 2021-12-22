
 const subBtn = document.querySelectorAll('#subButton');

var windowObjectReference = null; // global variable
var PreviousUrl; /* global variable that will store the
                    url currently in the secondary window */

 const openPopup =(url)=>{
     let newUrl =`/subscribe/new?subscriptionsKey=${url}`
  if(windowObjectReference == null || windowObjectReference.closed) {
    windowObjectReference = window.open(newUrl, "SingleSecondaryWindowName",
         "resizable,scrollbars,status");
  } else if(PreviousUrl != url) {
    windowObjectReference = window.open(newUrl, "SingleSecondaryWindowName",
      "resizable=yes,scrollbars=yes,status=yes");
    /* if the resource to load is different,
       then we load it in the already opened secondary window and then
       we bring such window back on top/in front of its parent window. */
    windowObjectReference.focus();
  } else {
    windowObjectReference.focus();
  };

  PreviousUrl = newUrl;
  /* explanation: we store the current url in order to compare url
     in the event of another call of this function. */


}


const subscriptions = async ()=>{
    try{
        let subs = await getSubscriptions();
        if(!subs){
            throw 'Error getting subscriptions';
        }

       

        // for(i=0;i>=subs.length;i++){
        //     console.log(subs.subs[i]);
        //     addSubscription('#subscriptions',subs.subs[i]);
        // }
        subs.subs.forEach((sub)=>{
            addSubscription('#subscriptions',sub);
        })

    }
    catch(error){
        throw error;
    }
}


$(document).ready(async ()=>{

    try{
        toastHolder(); // toast holder
        $('.toast').toast('show');

        await subscriptions();

        await events()



    }
    catch(error) {
        toast({message:error,title:'Something Unsual',bg:'bg-waring'});
    }

})





const events = async ()=>{
   
const subs = document.querySelectorAll('#subButton');

// console.log(subs);

subs.forEach(but=>{
    but.addEventListener('click',()=>{
        openPopup($(but).data('id'));
    })
})

    
}