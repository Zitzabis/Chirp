let NB = require('nodebrainz');
let nb = new NB({userAgent:'chirp/0.0.1 ( http://zitzasoft.com/ )'});
nb = new NB({host:'localhost', port:8080, basePath:'/path/to/data/', defaultLimit:50});
nb = new NB({retryOn: true, retryDelay: 3000, retryCount: 3});
let $ = require('jquery');
let Amplitude = require('./node_modules/amplitudejs/dist/amplitude.js');
let fs = require('fs');
let filename = 'contacts';
let sno = 0;

Amplitude.init({
      "bindings": {
            37: 'prev',
            39: 'next',
            32: 'play_pause'
      },
      "songs": [
            {
                  "name": "Poquito Mas",
                  "artist": "Infected Mushroom",
                  "album": "Legend Of The Black Shawarma",
                  "url": "./music/sample.flac",
                  "cover_art_url": "./music/sample.jpg"
            }
      ]
});

$( document ).ready(function() {
      let song = Amplitude.getActiveSongMetadata();
      console.log(song);
      
      $("#coverImage").attr("src",song.cover_art_url);

      loadAlbumCover();
});

Amplitude.getSongs().forEach(function(item){
      $('#currentSongs').append(item.name);
});

function loadAlbumCover () {
      let albumID;
      nb.search('release', {release:'Showbiz'}, function(err, response){
            albumID = response.releases[0].id;
            console.log(response.releases[0]);
            nb.release(albumID, function(err, response){

                  console.log(response);
            });
      });
      
}

function playButtonClick() {
      console.log("hi");
      $('#playButton').toggleClass('play');
      $('#playButton').toggleClass('pause');

      if ($('#playButton').hasClass('play')) {
            $('#playButton').html("Play");
      }
      if ($('#playButton').hasClass('pause')) {
            $('#playButton').html("Pause");
      }   
}
