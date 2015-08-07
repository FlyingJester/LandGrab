if(typeof LandGrab=="undefined")
    LandGrab = {};

TogetherJS.hub.on("callFoul", function(msg){
    var reporter = LandGrab.peers.getPeer(msg.clientID).name;
    var evildoer = LandGrab.peers.getPeer(msg.evildoer).name;
    AlertFoul(evildoer, reporter);
});

LandGrab.AlertFoul = function(evildoer, reporter){

    LandGrab.View.alert(
        (
            (reporter)?
            (reporter + " thinks"):
            "I think"
        ) + " that " + 
        (
            (evildoer)?
            evildoer:"someone"
        ) + " is cheating. Continue at your own risk.");
}

LandGrab.CallFoul = function(){}

if(typeof LandGrab.OnReadyCallbacks == "undefined")
    LandGrab.OnReadyCallbacks = [];

LandGrab.OnReadyCallbacks.push(function(){

    if(typeof LandGrab.peers == "undefined")
        LandGrab.peers = TogetherJS.require('peers');

    LandGrab.CallFoul = function(other){
        TogetherJS.send({"type":"callFoul", "evildoer":other});
        LandGrab.AlertFoul(other);
    }
});
