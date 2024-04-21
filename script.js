const progressInProgressBar = document.getElementById('song-progress');
const songProgressBar = document.getElementById('song-progressbar')
const playPauseButton = document.getElementById('playPauseButton');
const backwardStepButton = document.getElementById('backward-step-button');
const forwardStepButton = document.getElementById('forward-step-button');
const songTimeDisplay = document.getElementById('song-time')
const upcommingTrackList = document.getElementById('upcomming-songs');
const songInfoNameDisplay = document.getElementById("song-info-song-name");
const songInfoArtistDisplay = document.getElementById("song-info-song-artist");


const allSongs = [
    {
        id: 0,
        song: "Attention",
        artist: "NewJeans",
        duration: "3:00",
        src: "Sources/Songs/New Jeans/Attention.mp3",
        album: "New Jeans"
    },
    {
        id: 1,
        song: "Hype Boy",
        artist: "NewJeans",
        duration: "2:59",
        src: "Sources/Songs/New Jeans/Hype Boy.mp3",
        album: "New Jeans"
    },
    {
        id: 2,
        song: "Cookie",
        artist: "NewJeans",
        duration: "3:55",
        src: "Sources/Songs/New Jeans/Cookie.mp3",
        album: "New Jeans"
    },
    {
        id: 3,
        song: "Hurt",
        artist: "NewJeans",
        duration: "2:57",
        src: "Sources/Songs/New Jeans/Hurt.mp3",
        album: "New Jeans"
    }
]

let userData = {
    songs: [...allSongs],
    currentSong: null,
    currentTime: 0,
    state: false
};

const audio = new Audio();

const playSong = (id) => {
    const track = userData?.songs.find((song) => song.id === id);
    console.log(`TRACK.SONG = ${track.song}`);
    console.log(userData.currentSong?.song);

    if (track.id === userData?.currentSong?.id) {
        userData.currentTime = audio.currentTime;
        console.log(`userData.currentime set to ${audio.currentTime}`)
    }
    else {
        userData.currentTime = 0;
        console.log(`userData.currentime NOT set to ${audio.currentTime}`)
    }
    userData.currentSong = track;
    audio.src = track.src;
    audio.currentTime = userData.currentTime;
    audio.play();
    setPlayButtonPlaying();
    userData.state = true;
    setSongInfoDisplay();
    highlightCurrentSong();
}

const stopSong = () => {
    userData.currentTime = audio.currentTime;
    audio.pause();
    setPlayButtonStopping();
    userData.state = false;
}

const backwardStep = () => {
    console.log("BACKWARDS STEP")
    const currentSongIndex = getCurrentSongIndex();
    console.log(userData?.currentTime);
    console.log(currentSongIndex);

    if (userData?.currentTime <= 5 && currentSongIndex > 0) {
        playSong(userData.songs[currentSongIndex - 1].id);
    }
    else {
        replaySong();
    }
}

const forwardStep = () => {
    const currentSongIndex = getCurrentSongIndex();
    if (currentSongIndex < userData.songs.length - 1) {
        playSong(currentSongIndex + 1);
    }
    else {
        setTime(audio.duration);
        console.log(`USER DATA.CURRENT SONG ${JSON.stringify(userData.currentSong)}`);
    }
}

const displayTime = () => {
    const parseTime = () => {
        const minutes = Math.floor(userData.currentTime / 60);
        const seconds = Math.floor(userData.currentTime % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`};
    songTimeDisplay.innerHTML = `${parseTime()}/${userData.currentSong.duration}`;

}
const replaySong = () => {
    setTime(0);
    audio.play();
}

const setPlayButtonPlaying = () => {
    playPauseButton.innerHTML=`<i class="fas fa-pause icon"></i>`
}

const setPlayButtonStopping = () => {
    playPauseButton.innerHTML=`<i class="fas fa-play icon"></i>`
}

const renderSongs = (songList) => {
    const songsHTML = songList.map((track) => { 
        return `<li class="song-in-list" id="songid-${track.id}" >
        <button class="song-in-list-button buttons-strip" onclick="toggleSong(${track.id})">
          <div class="song-in-list-cover"><i class="fas fa-play icon icon-in-cover"></i></div>
          <div><h3 class="song-in-list-name">${track.song}</h3>
          <h4 class="song-in-list-artist-and-duration">${track.artist} ${track.duration}</h2>
          </div>
        </button>
      </li>`
    }).join("");
    console.log(songsHTML);
    upcommingTrackList.innerHTML = songsHTML;

}

const toggleSong = (id) => {
    console.log(userData?.currentTime.toString());
    console.log(userData?.state.toString());
    if (!userData.state || id !== userData.currentSong.id) {
        playSong(id);
        console.log("USER PLAY SONG")
    } else {
        stopSong();
        console.log("USER STOP SONG")
    }

}

const setSongInfoDisplay = () => {
    const song = userData.currentSong;
    songInfoNameDisplay.innerHTML = `${song.song}`;
    songInfoArtistDisplay.innerHTML = `${song.artist}`;
}

const highlightCurrentSong = () => {
    const playlistSongList = document.querySelectorAll(".song-in-list");
    const currentSongPlayingListItem = document.getElementById(`songid-${userData.currentSong.id}`);
    playlistSongList.forEach((songEl) => {songEl.removeAttribute("aria-current")});
    currentSongPlayingListItem.setAttribute("aria-current", true);
}

const updateProgressBar = () => {
    progressInProgressBar.style.width = `${(Math.floor(audio.currentTime)/audio.duration)*100}%`
}

//HELP FUNCTIONS
const getCurrentSongIndex = () => {
    console.log(`usercurrentsongid = ${userData.currentSong.id}`)
    return userData.songs.findIndex(({id}) => id === userData?.currentSong.id);
}

const setTime = (time) => {
    audio.currentTime = time;
    userData.currentTime = audio.currentTime;
}

//ADDING EVENT LSITENERS
playPauseButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
        console.log("USER NO A SONG")
        toggleSong(userData.songs[0].id);
        
    }
    else {
        console.log("USER HAS A SONG")
        toggleSong(userData.currentSong.id);
       
    }
})

backwardStepButton.addEventListener("click", () => {
    backwardStep();
})

forwardStepButton.addEventListener("click", () => {
    forwardStep();
})
audio.addEventListener("timeupdate", () => {
    userData.currentTime = audio.currentTime;
    displayTime();
    updateProgressBar();
}
);
audio.addEventListener("ended", () => {
    forwardStep();
})
renderSongs(userData?.songs)

songProgressBar.addEventListener("click", (e) => {
    const barWidth = parseInt(songProgressBar.getBoundingClientRect().width);
    const barLeft = parseInt(songProgressBar.getBoundingClientRect().left);
    const clientXPos = parseInt(e.clientX);
    audio.currentTime = audio.duration * ((clientXPos-barLeft)/barWidth);
})

window.addEventListener('keydown', (e) => {
    if (e.key == "ArrowRight") {
        forwardStep();
    }
    else if (e.key == "ArrowLeft") {
        backwardStep();
    }
    else if (e.key == " ") {
        e.preventDefault();
        if (userData?.currentSong === null) {
            console.log("USER NO A SONG")
            toggleSong(userData.songs[0].id);
            
        }
        else {
            console.log("USER HAS A SONG")
            toggleSong(userData.currentSong.id);
           
        }
    }
})



