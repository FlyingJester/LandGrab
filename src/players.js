if(typeof LandGrab=="undefined")
    LandGrab = {};

// clientID of players who are not observers. 
LandGrab.active_players_id = [];
LandGrab.game_started = false;

// If we see the game start ourselves, rather than asking, then we know who is or isn't active.
// This mainly determines if we call foul of players who have inconsistent observer state.
LandGrab.authoritative = false;

// Refreshes names over clientIDs
LandGrab.RefreshPlayerNames = function(){}

LandGrab.InitPlayers = function(){
    if(typeof LandGrab.peers == "undefined")
        LandGrab.peers = TogetherJS.require('peers');

    LandGrab.RefreshPlayerNames = function(){
        
        LandGrab.View.clearPlayers();
        
        LandGrab.peers.getAllPeers().concat([LandGrab.peers.Self]).forEach(
            function(i){
                var observer = LandGrab.active_players_id.indexOf(i.id)==-1;
                console.log("Player " + i.name + " (" + i.id + ") is now " + ((observer)?"an observer":"active"));
                LandGrab.View.appendPlayer(((i.name)?i.name:i.id), observer);
            }
        );
    }
    

    
    LandGrab.SetSelfObserving = function(o){
        TogetherJS.send({"type":"observerChange", "observing":o?true:false});
        LandGrab.SetObservingID(LandGrab.peers.Self.id, o);
    }
    
    LandGrab.RefreshPlayerNames();
    
}

LandGrab.Hello = function(){
    TogetherJS.send({"type":"hello"});
    window.setTimeout(LandGrab.RefreshPlayerNames, 1000);
    TogetherJS.send({"type":"observerPoll"});
}

LandGrab.SetSelfObserving = function(){}

TogetherJS.hub.on("hello", function(msg){
    LandGrab.RefreshPlayerNames();
});

LandGrab.SetObservingID = function(id, observing){
    var index = LandGrab.active_players_id.indexOf(id);
    if(index==-1 && (!observing)){
        LandGrab.active_players_id.push(id);
        console.log("Making player " + id + " active.");
    }
    else if (index!=-1 && observing){
        LandGrab.active_players_id.splice(index, 1);
        console.log("Making player inactive.");
    }
    else{
        console.log("No change to player, already " + ((observing)?"inactive":"active"));
    }
    LandGrab.RefreshPlayerNames();
}

TogetherJS.hub.on("observerChange", function(msg){
    console.log("observerChange event for " + msg.clientId);
    
    if(LandGrab.authoritative && LandGrab.game_started){
            /* If we don't have their ID in active players (==-1), they should be observing (true).
               If we do have their ID in active players (!=-1), they should not be observing. (false) */
        if((LandGrab.active_players_id.indexOf(LandGrab.peers.Self.id)==-1)==(msg.observing)){

            // We know something is afoot (game logic error, network issue, dastardly client, etc).
            LandGrab.CallFoul(msg.clientId);
            // We don't need to see any more.
            return;
        }
    }

    LandGrab.SetObservingID(msg.clientId, msg.observing);
});

TogetherJS.hub.on("observerPoll", function(msg){
    TogetherJS.send({
        "type":"observerChange", 
        "observing":LandGrab.active_players_id.indexOf(LandGrab.peers.Self.id)==-1
    });
});

if(typeof LandGrab.OnReadyCallbacks == "undefined")
    LandGrab.OnReadyCallbacks = [];

LandGrab.OnReadyCallbacks.push(LandGrab.InitPlayers);
LandGrab.OnReadyCallbacks.push(LandGrab.Hello);

//TODO For testing purposes.
TogetherJS.on("ready", function(){
    LandGrab.OnReadyCallbacks.forEach(function(i){ i(); });
});

