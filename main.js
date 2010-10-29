/*******************************************************************************************************
* Youtube HTML5 Autoplayer extension by JordonWii (jordonwii@gmail.com)                                    *
* Enables autoplaying of HTML5 videos on YouTube, which is not supported at the moment.                    *
*                                                                                                          *
* Because YouTube has yet to expose a public API for HTML5 videos,                                         *
* beyond the ones that HTML5 supports itself, the whole thing is something of a hack.                      *
* I have to use the combination of various styles (e.g. backgroundColor, backgroundPosition...)            *
* to determine which version of the player's "chrome" we are using (to inject the "Play next" button,      *
* and also to determine whether autoplay and shuffle are on.                                               *
*                                                                                                          *
* Autoplaying works by grabbing the video in the playlist bar who is the next sibling of the playing video.*
*                                                                                                          *
* This file contains v4.0 and later of this extension.  Earlier versions are in 'main-old.js'              *
***********************************************************************************************************/

BUTTON_ENABLED = {
    style:function(styles) {
        console.log(styles.backgroundPosition)
        if (styles.backgroundPosition == this.bp) {
            return true
        }
        else {
            return false
        }
    },
    use:"style"
}
            
PlayNextButton = new Class({
    initialize:function(autoplayer) {
        this.element = document.createElement("div")
        this.button = document.createElement("button")
        this.previousElement = $$(".html5-volume-control")[0]
        this.autoplayer = autoplayer
        
        this.element.appendChild(this.button)
        
        this.applyStylesToElement()
        this.applyStylesToButton()
        
        this.inject()
    },
    applyStylesToElement:function() {
        this.element.addClass("html5-button html5-control")
        this.element.setStyle("width", "29px")
        this.getEnglishSupported(function() {
            this.element.set("data-tooltip-title", "Play Next Video")
            this.element.set("data-tooltip", "Play Next Video")
            this.element.set("data-tooltip-timer", "5071")
            this.element.addClass("yt-uix-tooltip")

        }.bind(this))
    },
    getEnglishSupported:function(callback) {
        chrome.extension.sendRequest({
            getLang:"en-US"
        }, function(resp) {
            if (resp.hasLang) {
                callback.call(this)
            }
        })
    },
        
    applyStylesToButton:function() {
        this.button.set("src", "http://s.ytimg.com/yt/img/pixel-vfl73.gif")
        this.button.addClass("html5-icon")
        this.button.setStyles({
            backgroundImage:"url(http://s.ytimg.com/yt/img/master-vfl171252.png)",
            backgroundPosition:"-48px -140px",
            width:10,
            height:16,
            margin:"0 auto",
            marginLeft:9,
            marginTop:4,
            cursor:"pointer"
        })
    },
    inject:function() {
        this.previousElement.parentNode.insertBefore(this.element, this.previousElement)
        this.element.addEvent("click", this.autoplayer.playNextVideo.bind(this.autoplayer))
    }
})
YTButton = new Class({
    initialize:function(button) {
        //Button should be the actual element of the button
        this.button = button
    },
    enabled:function(funcs) {
        /* 
        This is the function that is called to ascertain whether this button is on or off.
        It is designed to be able to changed easily whenever YouTube changes their page
        
        'funcs' should be an object.  It defaults to the global "BUTTON_ENABLED".
        It can have any of the following 3 items, 
            each a function that returns true if the button is on, otherwise false:
        - class: passed the button's class(es),
        - style: passed the return of button.getStyles,
        - other: passed the button element itself;
        
        The following is required:
        - use: the key of the function to use;
        */
        
        if (!funcs) {
            funcs = window.BUTTON_ENABLED
        }
        if (!funcs.use) {
            throw "ValueError: Missing 'use' in YTButton.enabled"
        }
        var arg
        if (funcs.use == "class") {
            arg = this.button.get("class")
        }
        else if (funcs.use == "style") {
            arg = window.getComputedStyle(this.button)
        }
        else {
            arg = this.button
        }
        
        return funcs[funcs.use].call(this, arg)

    }
})
YTAutoPlayButton = new Class({
    Extends:YTButton,
    initialize:function() {
        this.parent($("quicklist-autoplay-button").getChildren("img")[0])
        this.bp = "-50px -118px"
    },
})
YTShuffleButton = new Class({
    Extends:YTButton,
    initialize:function() {
        this.parent($("quicklist-shuffle-button").getChildren("img")[0])
        this.bp = "-70px -118px"

    }
})
        
YTQuicklist = new Class({
    initialize:function() {
        this.element = $("quicklist")
        this.autoplay = new YTAutoPlayButton()
        this.shuffle = new YTShuffleButton()
    },
    getShuffleID:function() {
        //data-loaded-url contains the shuffle ID.
        //The url is prefaced with "/list_ajax?", which we don't want
        dataURL = this.element.get("data-loaded-url")
        return dataURL.substring(dataURL.lastIndexOf("?")).parseQueryString().shuffle
    },
    shuffleEnabled:function() {
        return this.shuffle.enabled()
    },
    autoplayEnabled:function() {
        return this.autoplay.enabled()
    },
    
    getNextVideo:function() {
        return $$(".quicklist-item-playing").getNext("li")[0]
    }
})
    
AutoPlayer = new Class({
    initialize:function() {
        this.video = this.getVideo()
        this.playNextButton = new PlayNextButton(this)
        this.quicklist = new YTQuicklist()
        this.queryString = window.location.search.substring(1).parseQueryString()
        
        //Can't use this.video.addEvent because Mootools doesn't like the event name "ended"
        this.video.addEventListener("ended", this.handleVideoEnded.bind(this))
    },
    handleVideoEnded:function(e) {
        if (this.quicklist.autoplayEnabled()) {
            this.playNextVideo()
        }
    },
    playNextVideo:function() {
        this.nextVid = this.quicklist.getNextVideo()
        this.nextURL = this.getNextURL()
        
        //Redirect to the next video
        location.href = this.nextURL
    },
    getNextURL:function() {
        //Assumes this.nextVid has already been defined
        nextHref = this.nextVid.getChildren()[0].get("href")
        params = nextHref.substring(nextHref.lastIndexOf("?")).parseQueryString()
        nextURL = nextHref.substring(0, nextHref.lastIndexOf("?"))
        console.log(params)
        console.log(nextURL)
        
        params.playnext = 1
        if (this.quicklist.shuffleEnabled()) {
            params.shuffle = this.quicklist.getShuffleID()
        }
        
        finalURL = nextURL + Object.toQueryString(params)
        return finalURL.replace("\n", "")
    },
    getVideo:function() {
        return $$("video")[0]
    }
})
new AutoPlayer()

