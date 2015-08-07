if(typeof LandGrab=="undefined")
    LandGrab = {};

// Layout for the View object.
LandGrab.NullView = {
    appendPlayer:function(name, observ){},
    setDice:function(D1, D2){}
};

LandGrab.HTMLView = {
    
    appendPlayer:function(name, observ){
    
        if(typeof observ == "undefined")
            observ = true;
    
        var new_player = document.createElement('li');
        new_player.innerHTML = name;
        if(observ){
            new_player.backgroundColor = 'lightgray';
        }
        
        document.getElementById('player_list').appendChild(new_player);
    }, // appendPlayer
    
    // Private data for Dice
    _dice:{
        _default_dot_size:6,
        _default_dot_margin:4,
        _default_dice_width:32,
        _default_dice_height:32,
        
        _positionDot:function(dot, p){
            dot.style.position = "absolute";
            dot.style.top = p.y+"px";
            dot.style.left = p.x+"px";
            dot.style.width = this._default_dot_size+"px";
            dot.style.height = this._default_dot_size+"px";
        },
        
        _generateDotPositions:function(n, m, w, h, s){
            if(typeof m == "undefined") m = this._default_dot_margin;
            if(typeof w == "undefined") w = this._default_dice_width;
            if(typeof h == "undefined") h = this._default_dice_height;
            if(typeof s == "undefined") s = this._default_dot_size;
            
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
        
        
        
    }, // _dice
    
    setDice:function(D1, D2){
        var dice_numbers = {"D1":D1, "D2":D2};
        
        // Draw pretty pictures
        for(var n = 1; n<3; n++){

            // Remove the old dice dots

            var DiceElement = document.getElementById('D'+n);
            var i = 0;
            while(i<DiceElement.childNodes.length){
                var child = DiceElement.childNodes[i];

                if(child.className=='dice_dot')
                    child.remove();
                else
                    i++;
            }
            // Add new dots
            this._dice._generateDotPositions(dice_numbers["D"+n]).forEach(function(i){
                var new_dot = document.createElement('img');
                new_dot.src = "img/dot_master.png";
                new_dot.className = 'dice_dot';
                this._positionDot(new_dot, i);
                
                DiceElement.appendChild(new_dot);
                
            }, this._dice);
        }

        // Set the total/text representation
        document.getElementById('dice_throw').innerHTML = D1 + ", " + D2 + " (" + (D1+D2) + ")";
    }, // setDice
};

LandGrab.View = LandGrab.HTMLView;
