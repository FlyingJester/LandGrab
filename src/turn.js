if(typeof LandGrab=="undefined")
    LandGrab = {};

LandGrab.whose_turn_id = null;

LandGrab.turn_order = [];

LandGrab.UpdateTurnOrderList = function(){}

LandGrab.StartMyTurn = function(){
    
    document.getElementById("dice_button").disabled = false;
}

LandGrab.EndMyTurn = function(){
    if(LandGrab.whose_turn_id!=LandGrab.peers.Self.id)
        LandGrab.View.alert("Assertion Failure: It must be your turn to end your turn.");
    
    document.getElementById("dice_button").disabled = true;
    
    TogetherJS.send({"type":"endTurn"});
    
    LandGrab.NextTurn();
    
}

LandGrab.NextTurn = function(){

    if(LandGrab.whose_turn_id==LandGrab.peers.Self.id)
        LandGrab.EndMyTurn();

    var index = LandGrab.turn_order.indexOf(LandGrab.whose_turn_id);
    var next_index = (index+1) % LandGrab.turn_order.length;
    
    LandGrab.whose_turn_id = LandGrab.turn_order[next_index];
    
    if(LandGrab.whose_turn_id==LandGrab.peers.Self.id)
        LandGrab.StartMyTurn();
    
}

LandGrab.AskWhoseTurn = function(){
    TogetherJS.send({"type":"askWhoseTurn"});
}

LandGrab.SayWhoseTurn = function(){
    if(LandGrab.whose_turn_id)
        TogetherJS.send({"type":"sayWhoseTurn", "who_id":LandGrab.whose_turn_id});
}

TogetherJS.hub.on("endTurn", function(msg){
    if(msg.clientID!=LandGrab.whose_turn_id || LandGrab.whose_turn_id==LandGrab.peers.Self.id){
        LandGrab.CallFoul(msg.clientID);
    }
    
    LandGrab.NextTurn();
    
    LandGrab.UpdateTurnOrderList();
    
});

TogetherJS.hub.on("askWhoseTurn", function(msg){
    LandGrab.SayWhoseTurn();
});

TogetherJS.hub.on("sayWhoseTurn", function(msg){
    
    var name = LandGrab.peers.getPeer(msg.who_id).name;
    
    if(LandGrab.whose_turn_id != msg.who_id)
        LandGrab.View.alert("Apparently, it's " + ((name && name!="null")?name:msg.who_id) + "'s turn.");

    while(LandGrab.whose_turn_id!=LandGrab.peers.Self.id){
        LandGrab.NextTurn();
    }

});

LandGrab.InitTurn = function(){
    if(typeof LandGrab.peers == "undefined")
        LandGrab.peers = TogetherJS.require('peers');

    LandGrab.whose_turn_id = LandGrab.peers.Self.id;
    LandGrab.StartMyTurn();
    LandGrab.AskWhoseTurn();
}

if(typeof LandGrab.OnReadyCallbacks == "undefined")
    LandGrab.OnReadyCallbacks = [];

LandGrab.OnReadyCallbacks.push(LandGrab.InitTurn);

//TODO For testing purposes.
TogetherJS.on("ready", function(){
    LandGrab.OnReadyCallbacks.forEach(function(i){ i(); });
});

