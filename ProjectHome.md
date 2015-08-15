For those of you using Chrome that want to use Youtube's HTML5 player but can't because it's missing one essential feature: autoplaying in playlists.

Right now, if you have opted in to use the HTML5 player, playlists won't autoplay, even if "Autoplay" is turned on.  This extension fixes that problem.
You can opt in to the HTML5 experiment at http://www.youtube.com/html5

If you have any issues or suggestions, please file a new issue by clicking "Issues" above.

## Download ##
You can download the extension from the Chrome extension gallery, at: https://chrome.google.com/extensions/detail/jnmhjffdnjlmpchejjdmpdbglfildmef

---

## Changelog ##

As of version 2, a "Play next in playlist" button is automatically added to HTML5 videos next to the play button (see the screenshot).

Version 2.1 fixed some problems with not detecting an HTML5 player if the page took more than a couple seconds to load.

2.11 fixed a bug in 2.1 where HTML5 players weren't detected.

2.12 fixed a problem where videos would be cut off a second too early.

2.13 attempts to fix some issues reported in the comments.

3.0 is language-independent and fixed problems reported in the comments.

3.1 works with Youtube's new playlist popup.

3.11 fixed some problems with the new Youtube interface.

3.12 fixes a problem with images not showing up in the playlist bar.

3.13 works with the new new interface.

3.14 adds shuffle support.

3.15 works with Youtube's updated url for playlists.

3.17 works with updated player "chrome" (mostly behind the scenes changes).

3.5 is also mostly behind-the-scenes changes: native HTML5 apis are now used to detect when the video finishes, etc.

3.51 works with a minor change to the Youtube shuffle button.

3.52 works with an updated Youtube interface.

3.53 provides a fix for the bug in the Chrome dev channel that prevents the playlist viewer (the playlist bar) from working (see http://crbug.com/54424 ).  It does not make anything else work, and it shouldn't break anything in the stable and beta channels.  It has a couple bugs: those will be fixed with the next version of Chrome.  Let me know in the comments if you see problems.

4.0 is a complete rewrite: makes the extension less buggy, and I no longer have to update the extension when YouTube makes minor changes to their pages.