var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21' },
        { title: 'Magenta', duration: '2:15' }
    ]
};

 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">'
    +   '    <td class="song-item-number" data-song-number="' + songNumber + '">'+ songNumber + '</td>'
    +   '    <td class="song-item-title">' + songName + '</td>'
    +   '    <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    return template;
}

var setCurrentAlbum = function(album) {
    // #1 
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
    
    // #2
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    
    // #3
    albumSongList.innerHTML = '';
    
    // # 4
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

// findParentByClassName() Method
// This is a modified version of my interpretioin the first st of requirement
// I had something similar to this, but when I saw the bloc implementation I changed my implementation

//var findParentByClassName = function(element, targetClass) {
////    var currentElement = document.getElementsByClassName(elementClass);
//    if (element.parentElement.className === targetClass) {            
//        return element.parentElement;
//    }
//    
//};

// bloc implementation
// After dissecting the Bloc implementation (see commented out portion below), I can see some of the differences
// between my implementation and the Bloc

var findParentByClassName = function(element, targetClass) {
    if (element) {
        var currentParent = element.parentElement;    
        if (currentParent) {        
            if (currentParent.className === targetClass) {
                while (currentParent.className != targetClass && currentParent.className !== null) {
                    currentParent = currentParent.parentElement;
                }
                return currentParent;
            } else 
                alert('No parent found with that class name');
        } else {
            alert('No Parent Found');
        }
    }
};

//var findParentByClassName = function(element, targetClass) {
//    if (element) {
//        var currentParent = <td class="song-item-number" data-song-number="2">2</td>.parentElement -> <tr class="album-view-song-item">...</tr> ;
//        while (currentParent.className ->album-view-song-item != targetClass -> album-view-song-item && currentParent.className -> album-view-song-item !== null) {
//            currentParent = currentParent.parentElement; <- not sure what's happening
//        }
//        return currentParent;
//    }
//};

// getSongItem() Method cruh_PEL implementation
//var getSongItem = function(element) {
//    var elementClass = element.className;
//    switch (elementClass) {
//        case '':
//            return something;
//    }
//};

// getSongItem() Method Bloc implementation
// I understand most of what's happening below, I'm not sure how I was supposed 
// to come up with this from the requirement given in the lesson
var getSongItem = function(element) {
    switch (element.className) {
        // Below are the four relationships described in the lesson here: https://www.bloc.io/users/jon-crappel/checkpoints/1384?roadmap_section_id=95#change-the-song-number-to-the-pause-button
        // There are cases to cover any situation, and to return the correct element
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);
    
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    songListContainer.addEventListener('mouseover', function(event) {
        var songItem = getSongItem(event.target)
        if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
            if (event.target.parentElement.className === 'album-view-song-item') {
                songItem.innerHTML = playButtonTemplate;    
            }
        }
    });
        
        for (var i = 0; i < songRows.length; i++) {
            songRows[i].addEventListener('mouseleave', function(event){
                
                var songItem = getSongItem(event.target);
                var songItemNumber = songItem.getAttribute('data-song-number');
                
                if (songItemNumber !== currentlyPlayingSong) {
                    songItem.innerHTML = songItemNumber;
                }
            });
            
            songRows[i].addEventListener('click', function(event) {
                clickHandler(event.target);
            });
        }
};

