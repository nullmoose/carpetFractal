var config = require('config');

function stream(req, res) {

	console.log('++++++++++');

	var clientId = config.soundcloud.key;
	var soundUrl = req.params.url;

	SC.initialize({client_id: clientId});

	SC.get('/resolve', { url: soundURL }, function(sound) {
	  if (sound.errors) {
	      return res.send(422, { error: sound.errors });
	  } else {
	  	  var streamUrl;

	      if(sound.kind=="playlist"){
	          streamPlaylistIndex = 0;
	          streamUrl = sound.tracks[streamPlaylistIndex].stream_url + '?client_id=' + clientId
	      }else{
	          streamUrl = sound.stream_url + '?client_id=' + clientId; 
	          // audioPlayer.setAttribute("src", streamUrl);
	          // audioPlayer.play();
	      }

	      return res.send(200,{ streamUrl: streamUrl });
	  }
	});
}

function setup(app) {
	app.get('/stream/:url',stream);
}

module.exports = setup;