/****************************************************************************************************************************
YouTube HTML5 Autoplayer -- By Wiiboy (jordonwii@gmail.com)
Implements basic autoplaying of playlists on YouTube with HTML5 player,
which doesn't support autoplaying at the time of writing. 

Unfortunately, the HTML5 player doesn't have the usual JS apis available either (at least, not that I could find).
Therefore, I had to write a simple function that infinite-loops and checks whether the duration equals the elapsed time
****************************************************************************************************************************/
setTimeout("setUp()", 2000)
var d
var c
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
function insertPlayNext()  {
    var p = (dojo.query("button.pause-button") || dojo.query("button.play-button"))[0]
    var v = dojo.query(".volume-segment")[0]
    var td = dojo.query("td.play-segment")[0]
    var n = dojo.doc.createElement("button")
    var b = dojo.doc.createElement("span")
    var ntd = dojo.doc.createElement("td")
    
    b.setAttribute("class", "icon")
    b.style.backgroundImage = "url(http://s.ytimg.com/yt/img/master-vfl171252.png)"
    b.style.backgroundPosition = "-48px -140px"
    b.style.width = "10px"
    b.style.height = "16px"
    b.style.margin = "0 auto"
    
    b.style.cursor = "pointer"
    
    n.appendChild(b)
    ntd.appendChild(n)
    td.parentNode.insertBefore(ntd, v)
    dojo.connect(n, "onclick", playNextVid)
}
function testTime() {
    if (getDuration() != "00:00") {
        handleTime()
    }
    else {
        setTimeout("testTime()", 1000)
    }
}
function setUp() {
    var player = dojo.query("div video")[0]
    if (player) {
        insertPlayNext()
        var time = getDuration()
        if (time == "00:00") {
            testTime()
        }
        else  {
            handleTime()
        }

    }
    else {
        console.log("Youtube HTML5 Autoplay: HTML5 player not found")
    }
}


function handleTime() {
    d = getDuration()
    c = getCurrentTime()
    if ((d == c) && (d != "00:00") && (c != "00:00")) {
        playNextVid()
        return
    }
    setTimeout("handleTime()", 500)
}
function getShuffleStatus() {
    return getButVal("Shuffle")
}
function playNextVid(e) {
    if ((!getAutoplay()) && (!e)) {
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
        if (getAutoplay()) {
            //Make sure autoplay is turned on -- we might be firing from the click of the Play Next button
            newPage = newPage + "&playnext=1"
        }
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