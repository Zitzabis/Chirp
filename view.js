let NB = require('nodebrainz');
let nb = new NB({userAgent:'chirp/0.0.1 ( http://zitzasoft.com/ )'});
nb = new NB({host:'localhost', port:8080, basePath:'/path/to/data/', defaultLimit:50});
nb = new NB({retryOn: true, retryDelay: 3000, retryCount: 3});
let $ = require('jquery');
let Amplitude = require('./node_modules/amplitudejs/dist/amplitude.js');
let fs = require('fs');
let filename = 'contacts';
let sno = 0;
let RangeSlider = require('./node_modules/rangeslider.js/dist/rangeslider.min.js');

var $document = $(document);
var $rangeslider = $('input[type=range]');
var $output = $('output');
var timelinePosition = 0;
var mediaPlayerState;
var duration = 0;

//Globals
var _STATUS = 0;

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
      ],
      "callbacks": {
            'after_stop': function(){
                  $('#playButton').html("Play");
                  clearTimeout(mediaPlayerState); //Set to display Play which means we pause the tick
                  _STATUS = 0;

                  $('#range').val(0).change();
            }
      }
});

// Initialize a new plugin instance for all
// e.g. $('input[type="range"]') elements.
$('input[type="range"]').rangeslider({

      // Feature detection the default is `true`.
      // Set this to `false` if you want to use
      // the polyfill also in Browsers which support
      // the native <input type="range"> element.
      polyfill: false,
  
      // Default CSS classes
      rangeClass: 'rangeslider',
      disabledClass: 'rangeslider--disabled',
      horizontalClass: 'rangeslider--horizontal',
      verticalClass: 'rangeslider--vertical',
      fillClass: 'rangeslider__fill',
      handleClass: 'rangeslider__handle',
  
      // Callback function
      onInit: function() {},
  
      // Callback function
      onSlide: function(position, value) {},
  
      // Callback function
      onSlideEnd: function(position, value) {}
  });

$( document ).ready(function() {
      console.log("test");
      let song = Amplitude.getActiveSongMetadata();
      console.log(song);
      
      $("#coverImage").attr("src",song.cover_art_url);

      loadAlbumCover();

      // Parse file and get duration
      $("#audio").prop("src", song.url);

      $rangeslider.rangeslider('update', true);
});

$("#audio").on("canplaythrough", function(e){
      var seconds = e.currentTarget.duration;

      // Calculate the required step size
      /* This needs heavy work. Right now I don't even know if it's truly making a difference */
      $('#range').attr('step',100/seconds);
      $('#range').hide().show();

      // Pass back out to global
      duration = seconds;
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
      $('#playButton').toggleClass('play');
      $('#playButton').toggleClass('pause');

      if ($('#playButton').hasClass('play')) {
            $('#playButton').html("Play");
            clearTimeout(mediaPlayerState); //Set to display Play which means we pause the tick
            _STATUS = 0;
      }
      if ($('#playButton').hasClass('pause')) {
            $('#playButton').html("Pause");
            // Set to display Pause which means we start the tick
            mediaPlayerPlay();
            _STATUS = 1;
      }   
}

// Simulate process of a media player 
var tick = function(callback) {
      mediaPlayerState = window.setTimeout(function() {
      timelinePosition++;
      callback();
      }, (duration * 1000)/100);
      return mediaPlayerState;
};

// Start the pseudo media player
var mediaPlayerPlay = function() {
      tick(mediaPlayerPlay);
      updateTimeline(timelinePosition);
};

// Update the timeline (time elapsed etc.)
var updateTimeline = function(value) {
      $rangeslider.val(value).change();
};

function manualRangeSelect() {
      console.log($('#range').val());
      Amplitude.setSongPlayedPercentage( Math.round($('#range').val()) );
      console.log("What");
      timelinePosition = $('#range').val();
}
