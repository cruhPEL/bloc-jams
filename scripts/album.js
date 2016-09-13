var createSongRow = function(songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">'
    +   '    <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '    <td class="song-item-title">' + songName + '</td>'
    +   '    <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function () {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
            
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerSongBar();
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            
        }
    };
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        
    };        
    
    $row.find('.song-item-number').click(clickHandler);
    
    $row.hover(onHover, offHover);
    
    return $row;
};

var nextSong = function() {
    // Req 1: Know what the previous song is. This includes the situation in which the next song is the first song, following the final song in the album (that is, it should "wrap" around).
    // my implementation
    
//    if (currentlyPlayingSong !== 0) {
//        previouslyPlayingSong = currentAlbum.songs[currentSongIndex-1];
//    } else { 
//        previouslyPlayingSong = currentAlbum.songs[4]; 
//    }
    
    // Bloc Req 1
    // Their implementation is better than mine (especially since mine doesn't work), but it's similar. The basic logic is the same. I.e. Is the currents song number equal to 0, no? then the previous song is whatever the current index is minus 1. If it is zero, then the previous song is the last song. This implementation is slightly different, but follows the same course.
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    // Req 2: Use the trackIndex() helper function to get the index of the current song and then increment the value of the index.
    // we had the same implementation for getting the index, but I differed slightly in how to increment. I also had not yet written the exception for if the current song went past the album length.
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Req 3: Set a new current song to currentSongFromAlbum.
    
    // I incremented my index within the function below, setting the new current song at the same time.
    
//    var newCurrentSong = function() {    
//        currentSongFromAlbum = currentAlbum.songs[currentSongIndex+1];  
//        updatePlayerSongBar();
//        
//    }
    
    // Bloc Req 3
    
    setSong(currentSongIndex + 1);
    
    
    // Req 4: Update the player bar to show the new song.
    
    // I did this in the function above, using the updatePlayerSongBar() function.
    
    updatePlayerSongBar();

    
    // Req 5 & 6: Update the HTML of the previous song's .song-item-number element with a number ... Update the HTML of the new song's .song-item-number element with a pause button.
    
    // I got stuck here and could not figure out how to get back into the html, but I can see what is being done. The previous song's number is stored in a variable that calls the first function we created. Then, to get the html for each element, the class selector is used, and the data attribute is accessed and has the appropriate song number passed into it.
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);    
    
};

var previousSong = function() {
    //
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    // 
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);          
    
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length -1;
    }
    
        
    // 
    setSong(currentSongIndex + 1);
    
    
    // 
    updatePlayerSongBar();

    
    // 
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);    
    
};


var setCurrentAlbum = function(album) {
    currentAlbum = album;
    
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty;
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);        
        
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerSongBar = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};


var setSong = function(songNumber) {
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
        
});


