function press(e){ 
    var t=e.keyCode || e.wich; 
    if(t==13){ 
        //enter
        return false; 
    } 
    console.log("dds");
    return true; 
} 

function scrollDown(){
    var scroll = document.getElementById("conversacion");
    //document.getElementById("conversacion").scrollBy(0,100);
    //scroll.scrollTop = scroll.scrollHeight;
    scroll.scrollIntoView(true);
    console.log("a tope");
  
}


var recordRTC;

navigator.getUserMedia({audio: true}, function(mediaStream) {
   recordRTC = RecordRTC(MediaStream);
});



function grabar(){
    recordRTC.startRecording();
}

function stop(){
    recordRTC.stopRecording(function(audioURL){
        audio.src = audioURL;
        
        var recorderBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function(dataURL){});
    
    });
}




