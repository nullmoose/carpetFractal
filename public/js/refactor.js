var Visualizer = function(){
  var canvas,
      ctx,
      audioStream,
      input;

  function playSound(soundURL){
    audioStream.playSound(soundURL);
  }

  setInterval(function(){clearCanvas();},2);
  setInterval(function(){draw(Math.round(canvas.width/3),0,0,0,5,true);},2);
}

var AudioStream = function(){
  var audioCtx,
      audioPlayer,
      analyserNode,
      audioSource,
      soundData,
      volumeData;

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

      setInterval(function(){analyseSound();},2);
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
  }

  function getSoundData(){
    return soundData;
  }

  function getVolumeData(){
    return volumeData;
  }
}

var InputForm = function(visualizer){
  var urlForm,
      urlText;

  this.visualizer = visualizer;

  function getURL(){
    return urlText;
  }

  this.init = function(){
    urlForm = document.getElementById("urlForm");
    urlText = document.getElementById("urlText");

    urlForm.addEventListener("submit", function(e){
        e.preventDefault();
        visualizer.playSound(urlText.value);
    });    
  }
}