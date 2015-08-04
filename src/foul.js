if(typeof LandGrab=="undefined")
    LandGrab = {};

TogetherJS.hub.on("callFoul", function(msg){
    AlertFoul(msg.other, msg.who);
});

function AlertFoul(other, who){
    alert(
        (
            (who)?
            (who + " thinks"):
            "I think"
        ) + " that " + 
        (
            (other)?
            other:"someone"
        ) + " is cheating. Continue at your own risk.");
}

LandGrab.CallFoul = function(other){
    TogetherJS.send({"type":"callFoul", "who":"NULL"});
    AlertFoul(other);
    
}
