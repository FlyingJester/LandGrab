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
    
    // Private data for the Board
    _board:{
                
        // One for each of the sides of the board
        _transformations:[
            function(i){ i.y++; },
            function(i){ i.x--; },
            function(i){ i.y--; },
            function(i){ i.x++; }
        ],
        _space_classes:[
            "right_side_space",
            "bottom_side_space",
            "left_side_space",
            "top_side_space"
        ],
        _tileDraw:function(i, e){
            // Create the space.
            {
                var space = document.createElement('div');
                space.style.position = "absolute";
                space.style.top = (this.position.y * this.board.tile_width+((this.position.y)?this.corner_offset:0))+"px";
                space.style.left = (this.position.x * this.board.tile_width+((this.position.x)?this.corner_offset:0))+"px";
                if((e % (this.board.tiles.length/4)) == 0){
                    // Draw a corner.
                    space.style.width =  this.board.tile_height+"px";
                    space.style.height =  this.board.tile_height+"px";
                }
                else{
                    // Just a space.
                    space.style.width =  this.sizes[this.which].w + "px";
                    space.style.height =  this.sizes[this.which].h + "px";
                }
                
                // Defaults.
                // DO NOT TRUST THIS TO STAY THE SAME.
                space.style.fontFamily = "Futura";
                
                // True, we only get color and backgroundColor on old browsers.
                // This will be standard in ES6.
                if(typeof i.style == "object" && typeof Object.assign == "function"){
                    Object.assign(space.style, i.style);
                }

                if(typeof i.color != "undefined")
                    space.style.color = i.color;
                if(typeof i.backgroundColor != "undefined")
                    space.style.backgroundColor = i.backgroundColor;

                space.className = 'space';
                space.id = "space_" + e;
                this.board_element.appendChild(space);
                
                var space_title = document.createElement('p');
                //space_title.className = space_classes[which];
                space_title.innerHTML = i.name;
                space_title.style.textAlign ="center";
                space.appendChild(space_title);
            }
            
            this.transformations[this.which](this.position);
            
            if(((e+1) % (this.board.tiles.length/4)) == 0)
                this.which++;
        }
    }, // _board
    
    clearBoard:function(){
        var board_element = document.getElementById("board");
        while(board_element.childNodes.length){
            board_element.childNodes[0].remove();
        }
    },
    
    drawBoard:function(board){
        
        var that = {
            "board":board,
            "sizes":[
                {"w":board.tile_height, "h":board.tile_width },
                {"w":board.tile_width,  "h":board.tile_height},
                {"w":board.tile_height, "h":board.tile_width },
                {"w":board.tile_width,  "h":board.tile_height}
            ],
            "board_element":document.getElementById("board"),
            "which":0,
            "position":{"x":board.tiles.length/4, "y":0},
            "corner_offset":(board.tile_height-board.tile_width),
            "transformations":this._board._transformations,
            "space_classes":this._board._space_classes,
        };
        
        board.tiles.forEach(this._board._tileDraw , that);

        
    }
    
};

LandGrab.View = LandGrab.HTMLView;
