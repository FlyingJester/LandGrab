if(typeof LandGrab=="undefined")
    LandGrab = {};

// Prototype. No worries about malicious clients.

LandGrab.SetDice = function(D1, D2){
    
    // Validate the roll
    if(typeof D1 != "number" || typeof D2 != "number"){
        throw new TypeError("D1 and D2 must both be numbers");
    }
    if(D1>6 || D1<1 || D2>6 || D2<1){
        throw new RangeError("Dice out of range (1-6)");
    }

    LandGrab.View.setDice(D1, D2);
}

TogetherJS.hub.on("diceRoll", function(msg){
    
    LandGrab.SetDice(msg.D1, msg.D2);
    
});

LandGrab.DiceRoll = function(){
    var D1 = 1 + (Math.random() * 6)>>0;
    var D2 = 1 + (Math.random() * 6)>>0;
    
    LandGrab.SetDice(D1, D2);
    
    TogetherJS.send({"type":"diceRoll", "D1":D1, "D2":D2});
}
