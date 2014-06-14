var canvas,
    ctx,
    audioCtx,
    source,
    analyserNode,
    soundData,
    volumeData,
    animateInterval,
    urlText,
    urlForm,
    audioPlayer,
    streamUrl,
    clientId;

function init(){
    canvas = document.getElementById("canvasFract");
    ctx = canvas.getContext("2d");

    audioCtx = new (window.AudioContext || window.webkitAudioContext);
    audioPlayer = document.getElementById("audioplayer");
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 256;
    soundData = new Uint8Array(128);
    volumeData = new Uint8Array(5);
    source = audioCtx.createMediaElementSource(audioPlayer);
    source.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);

    audioplayer.addEventListener("pause", function(e){
        clearInterval(setInterval(function(){analyseSound();},100));
    });

    urlForm = document.getElementById("urlForm");
    urlText = document.getElementById("urlText");

    urlForm.addEventListener("submit", function(e){
        e.preventDefault();
        playSound(urlText.value);
    });

    canvas.width  = Math.min(window.innerWidth, window.innerHeight);
    canvas.height = Math.min(window.innerWidth, window.innerHeight);

    clientId = "0fbc5c9836ca999eecbcfea77f90bc2f";

    clearCanvas();
    ctx.fillStyle = "rgb(200,0,0)";
    draw(Math.round(canvas.width/3),0,0,0,5,false);
}

function playSound(soundURL){
    SC.initialize({client_id: clientId});

    SC.get('/resolve', { url: soundURL }, function(sound) {
        if (sound.errors) {
            errorMessage = "";
            for (var i = 0; i < sound.errors.length; i++) {
                errorMessage += sound.errors[i].error_message + '<br>';
            }
            errorMessage += 'Make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track';
            console.log('There was an error: ' + errorMessage);
        } else {

            if(sound.kind=="playlist"){
                streamPlaylistIndex = 0;
                findStream = function(){
                    return sound.tracks[streamPlaylistIndex].stream_url + '?client_id=' + clientId;
                }
                streamUrl = findStream();
            }else{
                findStream = function(){ return sound.stream_url + '?client_id=' + clientId; };
                streamUrl = findStream();
                audioPlayer.setAttribute("src", streamUrl);
                audioPlayer.play();
            }
        }
    });

    animateInterval = setInterval(function(){animate();},2);
}

function animate(){
    analyseSound();
    clearCanvas();
    draw(Math.round(canvas.width/3),0,0,0,5,true);
}

function pauseButtonPressed(){
    clearInterval(animateInterval);
    console.log("pause button");
}

function playButtonPressed(){
    animateInterval = setInterval(function(){animate();},2);
    console.log("play button");
}

function analyseSound(){
    analyserNode.getByteFrequencyData(soundData);

    var v = 0;

    for(var i = 0; i < 5; i++){
        for(var n = 0; n < 20; n++){
            v += soundData[(i*20)+n];
        }
        volumeData[i] = v/20;
        v = 0;
    }

    for(var i; i < 5; i++){
        v += volumeData[i];
    }

    volumeData[0] = v/5;
}

function draw(l, x, y, de, dl, rand){

    var nl = Math.round(l/3);

    if (de<5) {
        draw(nl,x       ,y         ,de+1,dl,rand);
        draw(nl,x+l     ,y         ,de+1,dl,rand);
        draw(nl,x+(l*2) ,y         ,de+1,dl,rand);
        draw(nl,x       ,y+l       ,de+1,dl,rand);
        draw(nl,x+(l*2) ,y+l       ,de+1,dl,rand);
        draw(nl,x       ,y+(l*2)   ,de+1,dl,rand);
        draw(nl,x+l     ,y+(l*2)   ,de+1,dl,rand);
        draw(nl,x+(l*2) ,y+(l*2)   ,de+1,dl,rand);
    }

    var vl = 0;

    if(volumeData[de] < 50 && volumeData[de] > 30){
        vl = 2;
    }

    if(volumeData[de] < 80 && volumeData[de] > 50){
        vl = 4;
    }
    if(volumeData[de] < 120 && volumeData[de] > 80){
        vl = 6;
    }
    if(volumeData[de] > 120){
        vl = 8;
    }

    if (rand) {
        setColor(de);
    }
    ctx.fillRect((x+l)-(vl/2),(y+l)-(vl/2),l+vl,l+vl);
}

function setColor(de) {
    ctx.fillStyle = "rgb(" + soundData[(de*20)+(21-de*5)] + "," + soundData[(de*20)+(25-de*5)] + "," + soundData[(de*20)+(30-de*5)] + ")";
}

function setrandomColor(){
    red = Math.floor(Math.random()*255);
    green = Math.floor(Math.random()*255);
    blue = Math.floor(Math.random()*255);

    ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
}

function clearCanvas() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
