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
                  "cover_art_url": "/cover/art/url.jpg"
            }
      ]
});

$( document ).ready(function() {
      let song = Amplitude.getActiveSongMetadata();
      $("#my_image").attr("src",song.cover_art_url);

      $('#playButton');
});

Amplitude.getSongs().forEach(function(item){
      $('#currentSongs').append(item.name);
});

