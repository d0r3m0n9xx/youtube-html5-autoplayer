/****************************************************************************************************************************
YouTube HTML5 Autoplayer -- By Wiiboy (jordonwii@gmail.com)
Implements basic autoplaying of playlists on YouTube with HTML5 player,
which doesn't support autoplaying at the time of writing. 

Unfortunately, the HTML5 player doesn't have the usual JS apis available either (at least, not that I could find).
Therefore, I had to write a simple function that infinite-loops and checks whether the duration equals the elapsed time
****************************************************************************************************************************/
setTimeout("setUp()", 100)
var d
var c
var ii = 0
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
//    console.log("Button inserted")
}
function testTime() {
    if (getDuration() != "00:00") {
        handleTime()
    }
    else {
        setTimeout("testTime()", 1500)
    }
}
function setUp() {
//     console.log("SetUp called")
    var player = dojo.query("div video")[0]
    if (player) {
//         console.log("Player found")
        insertPlayNext()
        var time = getDuration()
//         console.log("Time = " + time)
        if (time == "00:00") {
//             console.log("Time = 00:00")
            testTime()
        }
        else  {
//             console.log("Calling handle time")
            handleTime()
        }

    }
    else {
//         console.log("Player _not_ found.  Loop: " + ii)
        if (ii < 20) {
            setTimeout("setUp()", 500)
        }
        ii++
    }
}


function handleTime() {
//     console.log("handleTime called")
    d = getDuration()
    c = getCurrentTime()
//     console.log("Duration: " + d)
//     console.log("Current time: " + c)
    if ((d == c) && getAutoplay()) {
//         console.log("Equal...calling playnextvid")
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
//         console.log("NOT CONTINUING")
        return
    }
    try {
        var newPage
        if (getShuffleStatus()) {
//             console.log("Shuffle is _on_")
            newPage = dojo.query("ul[class~='shuffle-next-video'] li a")[0].href
        }
        else {
// //             console.log("Shuffle _not_ on")
            newPage = dojo.query("ul[class~='serial-next-video'] li a")[0].href
        }
        if (getAutoplay()) {
//             console.log("Autoplay is on!")
            //Make sure autoplay is turned on -- we might be firing from the click of the Play Next button
            newPage = newPage + "&playnext=1"
        }
        if (getShuffleStatus()) {
            newPage = newPage + "&shuffle=1"
        }
        location.href = newPage
    }
    catch (e) {
        console.error("Youtube HTML5 Autoplayer: Failed to change videos")
        console.error("Error was: " + e)
    }
}
function getDuration() {
    return dojo.query("span[class='duration-time']")[0].innerHTML.toString()
}
function getCurrentTime() {
    return dojo.query("span[class='current-time']")[0].innerHTML.toString()
}