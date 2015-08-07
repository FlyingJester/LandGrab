if(typeof LandGrab=="undefined")
    LandGrab = {};

// Check out the LandGrab.authoritative usage in players.js to see where we are sure(ish) that
// someone will call foul of observer status changing during game play.

if(typeof LandGrab.OnReadyCallbacks == "undefined")
    LandGrab.OnReadyCallbacks = [];

//LandGrab.OnReadyCallbacks.push(LandGrab.InitTurn);

//TODO For testing purposes.
TogetherJS.on("ready", function(){
    LandGrab.OnReadyCallbacks.forEach(function(i){ i(); });
});

