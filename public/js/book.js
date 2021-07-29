const link =window.location.href;
const params = link.split('/');

const action=params[4];
const book = params[5];



$(document).ready(()=>{

    switch (action) {
        case "Edit":
            //Editing a book
            console.log(action,book);
            break;
        case "Read":
            //Reading a book
            console.log(action,book);
            break;
    
        default:
            window.location.href="/"
            break;
    }
   
})