if(typeof LandGrab=="undefined")
    LandGrab = {};

LandGrab.whose_turn = null;

LandGrab.SetTurn = function(){

}

LandGrab.StartMyTurn = function(){

}

LandGrab.EndMyTurn = function(){

}

LandGrab.TurnClientID = function(){
    for(var i in LandGrab.players){
        if(i.name==LandGrab.whose_turn){
            return i.clientID;
        }
    };
    
    return null;
}

LandGrab.AskWhoseTurn() = function(){
    TogetherJS.send({"type":"askWhoseTurn"});
}

LandGrab.SayWhoseTurn() = function(){
    TogetherJS.send({"type":"sayWhoseTurn", "who":LandGrab.whose_turn});
}

TogetherJS.hub.on("askWhoseTurn", function(msg){
    LandGrab.SayWhoseTurn();
});

TogetherJS.hub.on("sayWhoseTurn", function(msg){
    LandGrab.whose_turn = msg.who;
});

LandGrab.OnReadyCallbacks = LandGrab.OnReadyCallbacks || [];
LandGrab.OnReadyCallbacks.push(
    function(){
        LandGrab.whose_turn = LandGrab.me.name;
        LandGrab.AskWhoseTurn();
    }
);

//TODO For testing purposes.
TogetherJS.on("ready", function(){
    LandGrab.OnReadyCallbacks.forEach(function(i){ i(); });
});
