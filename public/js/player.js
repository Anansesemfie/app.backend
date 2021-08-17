const audio = document.createElement('audio');

const newSong = async (chapter)=>{
    const newFile = await getFile(chapter); 
    console.log(newFile);

    if(newFile != audio.src){
        audio.src=newFile;
        audio.load();
        audio.play();
    }
    else{
        audio.pause()
    }

}


//set audio controlls 
const playNow = ()=>{ //play and pause 
    if(audio.paused){
        audio.play();
    }
    else{
        audio.pause();
    }
}

// const seek






