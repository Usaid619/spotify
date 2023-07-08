window.addEventListener("load", bootUpApp)

const scrollDiv = document.getElementById("scroll-div")
const audioPlayer = document.querySelector("#audio-player")
const playButton = document.querySelector("#play")
const pauseButton = document.querySelector("#pause")

let currentSongObj = []
let defaultImage = "./Images/desktop-wallpaper-eminem-encore.jpg"

const time = document.querySelector(".time")

// Date Setting
const now = new Date()
const hour = now.getHours()

if(hour >5 && hour <12 ){
    time.textContent = "Good Morning"
} else if(hour >=12 && hour <13){
    time.textContent = "Good Noon"
} else if(hour >13 && hour <17){
    time.textContent = "Good Afternoon"
} else if(hour >17 && hour <20){
    time.textContent = "Good Evening"
} else{
    time.textContent = "Good Night"
}
// Date Setting


function bootUpApp(){
    fetchAndRenderAllSections()
}

function fetchAndRenderAllSections(){
    fetch("./gaana.json")
    .then(res => res.json())
    .then(res =>{
        const {cardbox} = res
        if(Array.isArray(cardbox) && cardbox.length){
            cardbox.forEach(section =>{
                const {songsbox, songscards} = section
                renderSection(songsbox,songscards)
            })
        }
    })
    .catch(err => console.log(err))
}

function renderSection(title,songsList){
const songsSection = makeSectionDom(title,songsList)
scrollDiv.appendChild(songsSection)
}

function makeSectionDom(title, songsList){
    const sectionDiv = document.createElement("div")
    sectionDiv.className = "songcards-div"

    sectionDiv.innerHTML = 
    `
    <div class="songcards-div">
                    <h2 class="greetings">${title}</h2> 
                    <div class="songcard-wrapper playlists-container">
                    ${songsList.map(songObj => buildSongCardDom(songObj)).join("")}
                    </div>
                </div>
`
return sectionDiv
}

function buildSongCardDom(songObj){
    const songObjInStr = encodeURIComponent(JSON.stringify(songObj)) 

return `
<div class="songcard" onclick="playSong('${songObjInStr}')">
<div class="contain">
<img src="${songObj.image_source}" alt="">
<div class="overlay">play</div>
</div>

<div class="song-title-wrap">
<h3>${songObj.song_name}</h3>
<p>${songObj.singers}</p>
   </div>
   </div>
`
}

function playSong(songObjInStr){
    const songObj = JSON.parse(decodeURIComponent(songObjInStr))
    setAndPlayCurrentSong(songObj)
}

function setAndPlayCurrentSong(songObj){
audioPlayer.pause()
audioPlayer.src = songObj.quality.high

audioPlayer.addEventListener("loadedmetadata",()=>{
    audioPlayer.currentTime = 0
    audioPlayer.play()
    updatePlayerUi(songObj)
})
}

function updatePlayerUi(songObj){
const songImage = document.querySelector("#song-image")
const songTitle = document.querySelector("#song-title")
const singer = document.querySelector("#singer")
const songCurrentTime = document.querySelector("#time-start")
const songTotalTime = document.querySelector("#total-time")

songImage.src = songObj.image_source
songTitle.innerHTML = songObj.song_name
singer.innerHTML = songObj.singers

audioPlayer.addEventListener("timeupdate",()=>{
    songCurrentTime.innerHTML = parseFloat(audioPlayer.currentTime/60).toFixed(2)
})

songTotalTime.innerHTML = parseFloat(audioPlayer.duration/60).toFixed(2)

changePlayButton()
}

function changePlayButton(){
    if(pauseButton.classList.contains("hidden")){
         playButton.classList.toggle("hidden")
    }
    
}