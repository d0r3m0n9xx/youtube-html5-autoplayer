/****************************************************************************************************************************
YouTube HTML5 Autoplayer -- By JordonWii (jordonwii@gmail.com)
Implements basic autoplaying of playlists on YouTube with HTML5 player,
which doesn't support autoplaying at the time of writing. 

Unfortunately, the HTML5 player doesn't have the usual JS apis available either (at least, not that I could find).
Therefore, I had to write a simple function that infinite-loops and checks whether the duration equals the elapsed time
****************************************************************************************************************************/
setTimeout("setUp()", 100)
var d
var c
var NEW_BUTTON_ON = "-100px -100px"
var NEW_BUTTON_OFF = "-79px -100px"
BUTTON_ON = "-59px -142px"
var params = dojo.queryToObject(window.location.search.slice(1))
var ii = 0
var ajaxURL = "http://www.youtube.com/list_ajax"
var ajaxParams = {
    p:params['p'],
    v:params['v'],
    index:params['index'],
    action_get_playlist:1,
    style:"bottomfeedr"
}
var requestComplete = false
var requestStarted =  true
function isNewVersion() {
    var s = window.getComputedStyle(dojo.query(".yt-uix-button-icon-quicklist-autoplay")[0])
    if (s.backgroundPosition == "-100px -100px" || s.backgroundPosition == "-79px -100px") {
        return true
    }
    else {
        return false
    }
}
function getButVal(i, pos) {
    var style = window.getComputedStyle(dojo.query(".yt-uix-button-icon-quicklist-autoplay")[i])
    if (style.backgroundPosition == pos) {
        return true
    }
    else {
        return false
    }
}
function getAutoplay() {
    return getButVal(0, BUTTON_ON)
}
function getShuffleStatus() {
    if (isNewVersion()) {
        return false
    }
    else {
        return getButVal(1, BUTTON_ON)
    }
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
        if (isNewVersion()) {
            window.BUTTON_ON = NEW_BUTTON_ON
            insertVideoList()
        }
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
        if (ii < 60) {
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
        playNextVid("this is a fake e")
        return
    }
    setTimeout("handleTime()", 500)
}
function insertVideoList() {
    var requestStarted = true
    chrome.extension.sendRequest({
        url:ajaxURL,
        params:ajaxParams
    }, function(response) {
            window.requestStarted = true
            window.requestComplete = true
            dojo.byId("quicklist-tray-active").innerHTML = response.playlistInfo
    })
    return "success"
}
function getNodeURL() {
    var playNode = dojo.query("li.quicklist-item-playing")[0]
    if (playNode && playNode != undefined) {
        return playNode.nextSibling.nextSibling.firstChild.href
    }
    else {
        return false
    }
}
function getNextVideoURL() {
    //Only for the _new_ version
    url = getNodeURL()
    if (url) {
        return url
    }

}
function playNextVid(e) {
    if ((!getAutoplay()) && (!e)) {
//         console.log("NOT CONTINUING")
        return
    }
    var newPage
    if (getShuffleStatus()) {
//             console.log("Shuffle is _on_")
        newPage = dojo.query("ul[class~='shuffle-next-video'] li a")[0].href
    }
    else {
//             console.log("Shuffle _not_ on")
        if (!isNewVersion()) {
            newPage = dojo.query("ul[class~='serial-next-video'] li a")[0].href
        }
        else {
            newPage = getNextVideoURL()
        }

    }
    if (getAutoplay()) {
//             console.log("Autoplay is on!")
//             Make sure autoplay is turned on -- we might be firing from the click of the Play Next button
        if (e) {
            newPage = newPage + "&playnext=1"
        }
    }
    if (getShuffleStatus()) {
        newPage = newPage + "&shuffle=1"
    }
    location.href = newPage
}
function getDuration() {
    return dojo.query("span[class='duration-time']")[0].innerHTML.toString()
}
function getCurrentTime() {
    return dojo.query("span.current-time")[0].innerHTML.toString()
}