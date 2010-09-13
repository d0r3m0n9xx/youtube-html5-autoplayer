/****************************************************************************************************************************
YouTube HTML5 Autoplayer -- By Wiiboy (jordonwii@gmail.com)
Implements basic autoplaying of playlists on YouTube with HTML5 player,
which doesn't support autoplaying at the time of writing. 

Unfortunately, the HTML5 player doesn't have the usual JS apis available either (at least, not that I could find).
Therefore,I had to find out the duration of the video, and then set a timer to change vids after the video should have ended.
I also couldn't find a way to ensure the video was loaded without just setting _another_ timer, which results in the
changing of the videos often being a couple seconds after the end of the video.
Really, this is all one big hack.  If you have a better method of doing this, 
feel free to email me, or make your own extension.
****************************************************************************************************************************/
setTimeout("setUp()", 1000)
var mainTimer
function getButVal(str) {
    var tf
    dojo.forEach(dojo.query("span.yt-uix-button-content"), function(obj) {
        if (obj.innerHTML.toString().match("^"+ str)) {
            if (obj.innerHTML.split(" ")[1][2] == "f") {
                tf = false
            }
            else {
                tf = true
            }
        }
    })
    return tf
}
function getAutoplay() {
    return getButVal("Autoplay")
}
       
function setUp() {
    var player = dojo.query("div video")[0]
    if (player) {
        var time = getDuration()
        if (time == "00:00") {
            setTimeout("handleTime()",2000)
        }
        else  {
            setVidTimeout(getVideoSeconds(time))
        }
    }
    else {
        console.log("Youtube HTML5 Autoplay Failed: HTML5 player not found")
    }
}
function getVideoSeconds(duration) {
    var total = 0
    var seconds = 0
    var minutes = 0
    var hours = 0
    if (duration.slice(-2, -1) == "0") {
        seconds = parseInt(duration.slice(-1))
    }
    else {
        seconds = parseInt(duration.slice(-2))
    }
    if (duration.slice(-5) == "0") {
        minutes = parseInt(duration.slice(-5, -4))*60
    }
    else {
        minutes = parseInt(duration.slice(-5, -3))*60
    }
    if (duration.length == 8) {
        hours = parseInt(duration.slice(0, 2))*60*60
    }
    else if (duration.length == 7) {
        hours = parseInt(duration.slice(0, 1))*60*60
    }
    total = seconds + minutes + hours
    return total
}
function setVidTimeout(seconds) {
    if (seconds == 0) {
        setTimeout("handleTime()", 500)
    }
    else {
        mainTimer = setTimeout("playNextVid()", seconds*1000)
//         checkPaused()
    }
}
function handleTime() {
//     var secs = getVideoSeconds(getDuration())
//     setVidTimeout(secs)
    setTimeout("handleTime()", 500)
    console.log(getDuration() == getCurrentTime())
    if (getDuration() == getCurrentTime()) {
        playNextVid()
    }
    return
}
function getShuffleStatus() {
    return getButVal("Shuffle")
}
function playNextVid() {
    if (!getAutoplay()) {
        return
    }
    try {
        var newPage
        if (getShuffleStatus()) {
            newPage = dojo.query("ul[class~='shuffle-next-video'] li a")[0].href
        }
        else {
            newPage = dojo.query("ul[class~='serial-next-video'] li a")[0].href
        }
        newPage = newPage + "&playnext=1"
        if (getShuffleStatus()) {
            newPage = newPage + "&shuffle=1"
        }
        location.href = newPage
    }
    catch (e) {
        console.log("Youtube HTML5 Autoplayer: Failed to change videos.")
    }
}
function getDuration() {
    return dojo.query("span[class='duration-time']")[0].innerHTML.toString()
}
function getCurrentTime() {
    return dojo.query("span[class='current-time']")[0].innerHTML.toString()
}
function getPlayerPaused() {
    if (dojo.query(".pause-button")) {
        return false
    }
    else {
        return true
    }
}