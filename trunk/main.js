/****************************************************************************************************************************
YouTube HTML5 Autoplayer -- By Jordon Wii (jordonwii@gmail.com)
Implements basic autoplaying of playlists on YouTube with HTML5 player,
which doesn't support autoplaying at the time of writing. 
****************************************************************************************************************************/
setTimeout("setUp()", 100)
var video
var d
var c
var NEW_BUTTON_ON = "-100px -100px"
var NEW_BUTTON_OFF = "-79px -100px"
BUTTON_ON = "-50px -118px"
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
    else if (s.backgroundPosition == "-50px -116px" || s.backgroundPosition == "-50px -100px") {
        return "new"
    }
    else if (s.backgroundPosition == "-50px -116px" || s.backgroundPosition == "-70px -100px") {
        return "newnew"
    }

    else {
        return false
    }
}
function isNewChromeVersion() {
    //Detects whether this is the new version of the player "chrome"
    var td = dojo.query("td.play-segment")[0]
    if (td) {
        return false
    }
    else {
        return true
    }
}
function getButVal(i, pos) {
    if (isNewVersion() == "new") {
        if (i == 0) {
            if (window.getComputedStyle(dojo.query(".quicklist-autoplay-off")[0]).display == "none") {
                return true
            }
            else {
                return false
            }
        }
        else if (i == 1) {
            if (dojo.query(".quicklist-shuffle-off")[0]) {
                if (window.getComputedStyle(dojo.query(".quicklist-shuffle-off")[0]).display == "none") {
                    return true
                }
                else {
                    return false
                }
            }
            else {
                if (window.getComputedStyle(dojo.query(".yt-uix-button-icon-quicklist-shuffle")[0]).backgroundPosition == BUTTON_ON) {
                    return true
                }
                else {
                    return false
                }
            }
        }
    }
    else {
        if (i == 0) {
            var style = window.getComputedStyle(dojo.query(".yt-uix-button-icon-quicklist-autoplay")[0])
        }
        else {
            var style = window.getComputedStyle(dojo.query(".yt-uix-button-icon-quicklist-shuffle")[0])
        }
        
        if (style.backgroundPosition == pos) {
            return true
        }
        else {
            return false
        }
    }
}
function getAutoplay() {
    return getButVal(0, BUTTON_ON)
}
function getShuffleStatus() {
    return getButVal(1, "-70px -118px")
}
function insertPlayNext()  {
    if (isNewChromeVersion()) {
        var v = dojo.query(".html5-volume-control")[0]
        var d = dojo.doc.createElement("div")
        var b = dojo.doc.createElement("img")
        b.src = "http://s.ytimg.com/yt/img/pixel-vfl73.gif"
        b.setAttribute("class", "html5-icon")
        
        d.setAttribute("class", "html5-button html5-control")
        d.appendChild(b)
        d.style.width = "29px"
    }
    else  {
        var p = (dojo.query("button.pause-button") || dojo.query("button.play-button"))[0]
        var v = dojo.query(".volume-segment")[0]
        var td = dojo.query("td.play-segment")[0]
        var n = dojo.doc.createElement("button")
        var b = dojo.doc.createElement("span")
        var ntd = dojo.doc.createElement("td")
        b.setAttribute("class", "icon")
    }
    b.style.backgroundImage = "url(http://s.ytimg.com/yt/img/master-vfl171252.png)"
    b.style.backgroundPosition = "-48px -140px"
    b.style.width = "10px"
    b.style.height = "16px"
    b.style.margin = "0 auto"
    
    b.style.cursor = "pointer"
    if (isNewChromeVersion()){
        b.style.marginLeft = "9px"
        b.style.marginTop = "4px"
        v.parentNode.insertBefore(d, v)
        dojo.connect(d, "onclick", "fake event!", playNextVid)
    }
    else {
        n.appendChild(b)
        ntd.appendChild(n)
        td.parentNode.insertBefore(ntd, v)
        dojo.connect(n, "onclick", "fake event!", playNextVid)
    }

}
function setUp() {
    video = dojo.query("div video")[0]
//     for (x in video) {console.log(x)}

    if (video) {
        insertPlayNext()
        if (isNewVersion()) {
            window.BUTTON_ON = NEW_BUTTON_ON
            insertVideoList()
        }
        video.addEventListener("ended", playNextVid)


    }
    else {
        if (ii < 60) {
            setTimeout("setUp()", 500)
        }
        ii++
    }
}

function swapImageAttrs() {
    dojo.forEach(dojo.query(".video-thumb .img"), function(obj) {
        node = obj.firstChild
        node.src = node.getAttribute("thumb")
        node.removeAttribute("thumb")
    })
}
function insertVideoList() {
    var requestStarted = true
    chrome.extension.sendRequest({
        url:ajaxURL,
        params:ajaxParams,
        shuffle:getShuffleStatus()
    }, function(response) {

            window.requestStarted = true
            window.requestComplete = true
            dojo.byId("quicklist-tray-active").innerHTML = response.playlistInfo
            swapImageAttrs()
    })
    return "success"
}

function getNodeURL() {
    var playNode = dojo.query("li.quicklist-item-playing")[0]
    if (playNode && playNode != undefined && playNode.nextSibling.nextSibling.firstChild.href != undefined) {
        return playNode.nextSibling.nextSibling.firstChild.href
    }
    else {
        return dojo.query("li.quicklist-item")[0].firstChild.href
          
    }
}
function getNextVideoURL() {
    //Only for the _new_ version
    url = getNodeURL()
    if (url) {
        return url
    }

}
function playNextVid() {
    //If 'e' is true, this is the button.  Otherwise, the video ended and we need to autoplay.
    if (this == "fake event!") {
        e = true
    }
    else {
        e = false
    }
    
    //If this is not the button and autoplay is off, do nothing.
    if ((!getAutoplay()) && (!e)) {
        return
    }
    
    //Looks like we're continuing.
    //Getting the page is dependent on whether this is the old or new version of the Youtube UI.
    var newPage
    if (!isNewVersion) {
        //Old version
        if (getShuffleStatus()) {
            newPage = dojo.query("ul[class~='shuffle-next-video'] li a")[0].href
        }
        else {
            newPage = dojo.query("ul[class~='serial-next-video'] li a")[0].href
        }
    }
    else {
        //New version
        newPage = getNextVideoURL()
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