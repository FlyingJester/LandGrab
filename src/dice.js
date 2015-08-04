if(typeof LandGrab=="undefined")
    LandGrab = {};

// Prototype. No worries about malicious clients.


function SetDice(D1, D2){
    
    if(typeof D1 != "number" || typeof D2 != "number"){
        throw new TypeError("D1 and D2 must both be numbers");
    }
    if(D1>6 || D1<1 || D2>6 || D2<1){
        throw new RangeError("Dice out of range (1-6)");
    }
    
    document.getElementById('dice_throw').innerHTML = "" + D1 + ", " + D2 + " (" + (D1+D2) + ")";
    
}

TogetherJS.hub.on("diceRoll", function(msg){
    
    SetDice(msg.D1, msg.D2);
    
});

function DiceRoll(){
    var D1 = 1 + (Math.random() * 6)>>0;
    var D2 = 1 + (Math.random() * 6)>>0;
    
    SetDice(D1, D2);
    
    TogetherJS.send({"type":"diceRoll", "D1":D1, "D2":D2});
    SetSomething(changed_to);
}
