function init(){
    var vis = new Visualizer();

    vis.init();
}

var Visualizer = function(){
  var canvas,
      ctx,
      audioStream,
      input,
      animateInterval;

  var self = this;

  this.playSound = function(soundURL){
    audioStream.playSound(soundURL);

    animateInterval = setInterval(function(){self.animate();},2);
  }

  this.stop = function(){
    clearInterval(animateInterval);
  }

  this.resume = function(){
    animateInterval = setInterval(function(){self.animate();},2);
  }

  this.animate = function(){
    audioStream.analyseSound();
    self.clearCanvas();
    self.draw(Math.round(canvas.width/3),0,0,0,5,true);
  }

  this.draw = function(l, x, y, de, dl, rand){
    var nl = Math.round(l/3);

    if (de<5) {
        self.draw(nl,x       ,y         ,de+1,dl,rand);
        self.draw(nl,x+l     ,y         ,de+1,dl,rand);
        self.draw(nl,x+(l*2) ,y         ,de+1,dl,rand);
        self.draw(nl,x       ,y+l       ,de+1,dl,rand);
        self.draw(nl,x+(l*2) ,y+l       ,de+1,dl,rand);
        self.draw(nl,x       ,y+(l*2)   ,de+1,dl,rand);
        self.draw(nl,x+l     ,y+(l*2)   ,de+1,dl,rand);
        self.draw(nl,x+(l*2) ,y+(l*2)   ,de+1,dl,rand);
    }

    var vl = 0;

    if(audioStream.getVolumeData(de) < 50 && audioStream.getVolumeData(de) > 30){
        vl = 2;
    }

    if(audioStream.getVolumeData(de) < 80 && audioStream.getVolumeData(de) > 50){
        vl = 4;
    }
    if(audioStream.getVolumeData(de) < 120 && audioStream.getVolumeData(de) > 80){
        vl = 6;
    }
    if(audioStream.getVolumeData(de) > 120){
        vl = 8;
    }

    if (rand) {
        self.setColor(de);
    }
    ctx.fillRect((x+l)-(vl/2),(y+l)-(vl/2),l+vl,l+vl);
  }

  this.setColor = function(de) {
      ctx.fillStyle = "rgb(" + audioStream.getSoundData((de*20)+(21-de*5)) + "," + audioStream.getSoundData((de*20)+(25-de*5)) + "," + audioStream.getSoundData((de*20)+(30-de*5)) + ")";
  }

  this.setrandomColor = function(){
      red = Math.floor(Math.random()*255);
      green = Math.floor(Math.random()*255);
      blue = Math.floor(Math.random()*255);

      ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
  }

  this.clearCanvas = function() {
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  this.init = function(){
    canvas = document.getElementById("canvasFract");
    ctx = canvas.getContext("2d");

    audioStream = new AudioStream(self);
    audioStream.init();

    input = new InputForm(self);
    input.init();

    canvas.width  = Math.min(window.innerWidth, window.innerHeight);
    canvas.height = Math.min(window.innerWidth, window.innerHeight);

    self.clearCanvas();
    ctx.fillStyle = "rgb(200,0,0)";
    self.draw(Math.round(canvas.width/3),0,0,0,5,false);
  }
}

var AudioStream = function(visualizer){
  var audioCtx,
      audioPlayer,
      analyserNode,
      audioSource,
      soundData,
      volumeData;

  this.visualizer = visualizer;

  var self = this;

  this.playSound = function(soundURL){

    var encoded = encodeURIComponent(soundURL);

    $.get('/stream/'+encoded,function(data){
      var streamUrl = data.streamUrl;
      audioPlayer.setAttribute("src", streamUrl);
      audioPlayer.play();
    }).fail(function(){
      alert('error');
    });
  }

  this.analyseSound = function(){
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

  this.getSoundData = function(n){
    return soundData[n];
  }

  this.getVolumeData = function(n){
    return volumeData[n];
  }

  this.init = function(){
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
      self.visualizer.stop();
    });

    audioplayer.addEventListener("play", function(e){
      self.visualizer.resume();
    });
  }
}

var InputForm = function(visualizer){
  var urlForm,
      urlText;

  var self = this;

  this.visualizer = visualizer;

  this.getURL = function(){
    return urlText.value;
  }

  this.init = function(){
    urlForm = document.getElementById("urlForm");
    urlText = document.getElementById("urlText");

    urlForm.addEventListener("submit", function(e){
        e.preventDefault();
        self.visualizer.playSound(urlText.value);
    });    
  }
}