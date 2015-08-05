if(typeof LandGrab=="undefined")
    LandGrab = {};

// Prototype. No worries about malicious clients.

LandGrab.default_dot_size = 6;
LandGrab.default_dot_margin = 4;
LandGrab.default_dice_width = 32;
LandGrab.default_dice_height = LandGrab.default_dice_width;

LandGrab.PositionDot = function(dot, p){
    dot.style.position = "absolute";
    dot.style.top = p.y+"px";
    dot.style.left = p.x+"px";
    dot.style.width = LandGrab.default_dot_size+"px";
    dot.style.height = LandGrab.default_dot_size+"px";
}

LandGrab.GenerateDotPositions = function(n, m, w, h, s){
    if(typeof m == "undefined") m = LandGrab.default_dot_margin;
    if(typeof w == "undefined") w = LandGrab.default_dice_width;
    if(typeof h == "undefined") h = LandGrab.default_dice_height;
    if(typeof s == "undefined") s = LandGrab.default_dot_size;
    
    var dots = [];
    
    var left   = m;
    var right  = w-m-s;
    var top    = m;
    var bottom = h-m-s;
    var center = {x:(w - s)>>1, y:(h - s)>>1};
    
    if(n%2==1){
        dots.push({x:center.x, y:center.y});
    }
    
    if(n>1){
        dots.push({x:left, y:top});
        dots.push({x:right, y:bottom});
    }
    if(n>3){
        dots.push({x:right, y:top});
        dots.push({x:left, y:bottom});
    }
    if(n==6){
        dots.push({x:left, y:center.y});
        dots.push({x:right, y:center.y});
    }
    
    return dots;
    
}

LandGrab.SetDice = function(D1, D2){
    
    // Validate the roll
    if(typeof D1 != "number" || typeof D2 != "number"){
        throw new TypeError("D1 and D2 must both be numbers");
    }
    if(D1>6 || D1<1 || D2>6 || D2<1){
        throw new RangeError("Dice out of range (1-6)");
    }
    
    var dice_numbers = {"D1":D1, "D2":D2};
    
    // Draw pretty pictures
    for(var n = 1; n<3; n++){

        // Remove the old dice dots

        var DiceElement = document.getElementById('D'+n);
        var i = 0;
        while(i<DiceElement.childNodes.length){
            var child = DiceElement.childNodes[i];

            if(child.className=='dice_dot')
                DiceElement.removeChild(child);
            else
                i++;
        }
        // Add new dots
        LandGrab.GenerateDotPositions(dice_numbers["D"+n]).forEach(function(i){
            var new_dot = document.createElement('img');
            new_dot.src = "img/dot_master.png";
            new_dot.className = 'dice_dot';
            LandGrab.PositionDot(new_dot, i);
            
            DiceElement.appendChild(new_dot);
            
        });
    }

    // Set the total/text representation
    document.getElementById('dice_throw').innerHTML = D1 + ", " + D2 + " (" + (D1+D2) + ")";

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
