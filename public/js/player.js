const audio = document.createElement('audio');

const player = $('#player');
const audtitle = $('#audioTitle');

const playPauseButton = $('#playPause');
const fastForward = $('#fstForward');
const fastBack = $('#fstBack');

const muteButton = $('#muteBtn');
const volumeDrag = document.getElementById('volumeRange');


const curTIme = $('#curTime');
const durTIme = $('#durTime');




const newSong = async (chapter)=>{
    try{
    const newFile = (await getFile(chapter)).audio; 
    // const file=newFile.audio;
    // console.log(myUrl()+newFile.medPath);


    if(myUrl()+newFile.path != audio.src){
        audio.src=newFile.path;//set audio path

        // console.log(newFile.length);

        audio.load();//load audio
        audtitle.text(`${newFile.title} playing.....`)
        playNow();
        setTimeout(()=>{
            checkDuration(audio.duration,newFile.length,newFile.message);
        },100)
        
        
    }
    else{
        
        playNow()
        
    }
    }
    catch(error){
        throw error;
    }
    

}


//set audio controlls 
const playNow = ()=>{ //play and pause 
    if(audio.paused){
        audio.play().then(()=>{
        playPauseButton.html(`<i class="fas fa-pause fa-2x"></i>`);
        return true;
        }).catch((err)=>{
            throw 'Could not play';
        })
        
    }
    else{
        audio.pause();
        playPauseButton.html(`<i class="fas fa-play fa-2x"></i>`);
    }
}

// audio playing
audio.addEventListener('play',()=>{
    player.find('*').attr('disabled', false);
    playPauseButton.html(`<i class="fas fa-play fa-2x"></i>`);
    setInterval(() => {
        timeLeft();
        if(done()){
            audio.pause();
            playPauseButton.html(`<i class="fas fa-play fa-2x"></i>`);
        }
    }, 1);
})

// audio pause
audio.addEventListener('pause',()=>{
//    alert('paused')
   playPauseButton.html(`<i class="fas fa-play fa-2x"></i>`)
})


//volume
volumeDrag.addEventListener('input',()=>{
    let volume =volumeDrag.value;
    audio.volume=parseFloat(volume)*0.01;
        if(volume>10&& volume<50){
            
           //mid way
            muteButton.html(`<i class="fas fa-volume-down"></i>`);

        }
        else if(volume>50 && volume<=100){
            // console.log('50-100',volume);
           //mute
            muteButton.html(`<i class="fas fa-volume-up"></i>`);
           
        }
        else if(volume>0 && volume <=10){
            //low volume
           
            muteButton.html(`<i class="fas fa-volume-off"></i>`);
        }
        else{
            //mute
            muteButton.html(`<i class="fas fa-volume-mute"></i>`);
        }
})


//mute
muteButton.on('click',()=>{
    // alert('mute click')
    if(audio.muted){
        audio.volume=0.1;
        muteButton.html(`<i class="fas fa-volume-up"></i>`);
    }
    else{
        audio.volume=0;
        volumeDrag.value=0;
        muteButton.html(`<i class="fas fa-volume-mute"></i>`);
    }
});

playPauseButton.on('click',()=>{
    // alert('play b/tn');
    if(!audio.src){
        return 0;
    }
    else{
        playNow()
    }
    
})



//fast forward
fastForward.on('click',()=>{
     let timeNow = audio.duration - audio.currentTime;//chect for remaining

    if(timeNow<5){
        return 0
    }
    else{
       audio.currentTime+=5;  
    }
   
})

//fast backward
fastBack.on('click',()=>{
    if(audio.currentTime<5){
        return 0
    }
    else{
         audio.currentTime-=5;
    }
   
})

//time manage
const timeLeft = ()=>{
   
    durTIme.text(calculateTime(audio.duration));
    curTIme.text(calculateTime(audio.currentTime));
}

//done
const done = ()=>{
    if(audio.currentTime == audio.duration){

        return true;
    }
    else{
        return false;
    }
}

// sec to minute
const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  }



  //check duration 
  const checkDuration =async (duration,allow,info)=>{
            let stopHere = duration*allow;
                    console.log(stopHere,allow);
                    setInterval(() => {
                    
                        if(audio.currentTime >= stopHere){
                    audio.pause();
                    audio.src='';
                    audtitle.text(info);
                    playPauseButton.html(`<i class="fas fa-play fa-2x"></i>`);
                    

                }
                    }, 100);
      
  }