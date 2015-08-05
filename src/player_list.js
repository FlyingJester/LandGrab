if(typeof LandGrab=="undefined")
    LandGrab = {};

LandGrab.gullible = true;
TogetherJSConfig_dontShowClicks = true;

LandGrab.Player = function(name, observ, clientID){
    if(typeof observ == "undefined") observ = false;
    this.clientID = clientID;
    this.name = name;
    this.observer = true && observ; // Coerce a boolean
}

LandGrab.players = [];

LandGrab.AddPlayer = function(p){
    
    if(! (p instanceof LandGrab.Player))
        throw new TypeError("Invalid LandGrab.Player object");
    
    LandGrab.players.push(p);

}

LandGrab.ResetPlayers = function(){
    LandGrab.players = [];
}

LandGrab.me = null;

LandGrab.SetMe = function(p, o){
    if(typeof p=="string" && typeof o=="boolean"){
        p = new LandGrab.Player(p, o);
    }
    
    if(! (p instanceof LandGrab.Player)){
        throw new TypeError("Invalid LandGrab.Player object");
    }
    
    var was_set = !(LandGrab.me==null);
    
    LandGrab.me = p;
    
    console.log("`ME` Was " + ((was_set)?"set":"not set"));
    
    if(!was_set){
        LandGrab.AddPlayer(LandGrab.me);
    }
    
    alert("Name set to " + LandGrab.me.name);
    
}

TogetherJS.hub.on("announcePlayers", function(msg){
    msg.players.forEach(function(i){
        var found = false;
        LandGrab.players.forEach(function(e){
            if(e.name==i.name){
                if(LandGrab.gullible)
                    e.observer = i.observer;
                found = true;
            }   
        });
        if(!found){
            LandGrab.AddPlayer(new LandGrab.Player(i.name, i.observer));
        }
    });
});


LandGrab.AskForPlayerLists = function(){
    TogetherJS.send({"type":"askPlayers"});
}

TogetherJS.hub.on("askPlayers", function(msg){
    LandGrab.TransmitPlayerList();
});

LandGrab.TransmitPlayerList = function(){
    var players = new Array(LandGrab.players.length);
    LandGrab.players.forEach(function(p, i){
        players[i] = {"name":p.name, "observer":p.observer};
    });
    
    TogetherJS.send({"type":"announcePlayers", "players":players});
}

if(typeof LandGrab.OnReadyCallbacks == "undefined")
    LandGrab.OnReadyCallbacks = [];

LandGrab.OnReadyCallbacks.push(
    function(){
        LandGrab.SetMe("UnsetName" + ((Math.random() * (1<<16))>>0), false);
        // Announce ourselves
        LandGrab.TransmitPlayerList();
        // Ask for everbody else
        LandGrab.AskForPlayerLists();
        
        // Particularly for the first player, this must be done after LandGrab.me is set.
        // For simplicity, we just call it right here to ensure that SetMe was called.
        LandGrab.InitTurn();
    }
);

//TODO For testing purposes.
TogetherJS.on("ready", function(){
    LandGrab.OnReadyCallbacks.forEach(function(i){ i(); });
});
