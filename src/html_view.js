if(typeof LandGrab=="undefined")
    LandGrab = {};

LandGrab.HTMLView = {
    
    _players:{
        _number_players:0,
        _active_colors:['#B87840', '#C08040'],
        _inactive_colors:['#D3D3D3', '#B0B0B0'],
        _getActiveColor:function(){
            return this._active_colors[this._number_players%2];
        },
        _getInactiveColor:function(){
            return this._inactive_colors[this._number_players%2];
        },
    },
    
    _clearAll:function(i){
        while(i.childNodes.length)
            i.childNodes[0].remove();
    },

    clearPlayers:function(){
        this._players._number_players = 0;
        this.clearActivePlayers();
        this.clearWatchingPlayers();
    },
    
    clearWatchingPlayers:function(){
        this._clearAll(document.getElementById('all_player_list'));
    },
    
    clearActivePlayers:function(){
        this._clearAll(document.getElementById('active_player_list'));
    },
    
    appendPlayer:function(name, observ){
        
        ++(this._players._number_players);
        
        if(typeof observ == "undefined")
            observ = true;
    
        var new_player = document.createElement('li');
        new_player.innerHTML = name;
        if(observ){
            new_player.style.backgroundColor = this._players._getInactiveColor();
        }
        else{
            new_player.style.backgroundColor = this._players._getActiveColor();
        }
        
        document.getElementById('all_player_list').appendChild(new_player);
        
    }, // appendPlayer
    
    setActivePlayers(players){
        var player_list = document.getElementById('active_player_list');
        players.forEach(function(i){
            var new_player = document.createElement('li');
            new_player.innerHTML = (typeof i == "string")?i:i.name;
            new_player.style.backgroundColor = this._players._getActiveColor();
            
            player_list.appendChild(new_player);
        
        });
    },
    
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

        
    },
    
    rollForOrderPopup:function(peers, active_ids, onRoll){
    
        var screen_width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var screen_height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
    
                /* 42 is the height of the heading */
                /* 10px borders (double between table and friends) */
                /* 24 height buttons on bottom */
        var height = 42 + ((10 * 2) * 2) + (10 * 2) + 24;
        var width = 400;
        var popup = document.createElement('div');
        popup.style.backgroundColor = "#CB934E";
        popup.style.color  = "#644826";
        popup.style.position = "fixed";
        popup.style.height = height + "px";
        popup.style.width  = width  + "px";
        popup.style.top    = ((screen_height - height)>>1) + "px";
        popup.style.left   = ((screen_width - width)>>1) + "px";
        
        { // Generate Titlebar
            var titlebar = document.createElement('div');
            titlebar.style.margin = "10px";
            titlebar.style.padding = "1pt";
            titlebar.style.display = "block";
            titlebar.style.overflow = "hidden";
            titlebar.class = "popup_titlebar";
            { // Generate Title
                // TODO: let
                var heading = document.createElement('h2');
                heading.style.position = "relative";
                heading.style.float = "left";
                heading.style.margin = "1pt";
                heading.innerHTML = "Determine Turn Order";
                titlebar.appendChild(heading);
            }
            { // Generate Close Button
                // TODO: let
                var close_button = document.createElement('div');
                // TODO: Check if the popup is actually done before closing.
                close_button.onclick = function(){popup.remove();};
                close_button.style.position = "relative";
                close_button.style.float = "right";
                close_button.style.height = "42px";
                close_button.style.width = "42px";

                close_button.style.backgroundColor = "red";
                titlebar.appendChild(close_button);
            }
            popup.appendChild(titlebar);
        }
        { // Generate Player Table
            this._players._number_players = 0;
            // TODO: let
            var player_table = document.createElement('table');
            
            var head_row = player_table.insertRow(0);
            
            var labels = [head_row.insertCell(0), head_row.insertCell(1), head_row.insertCell(2)];
            labels.forEach(function(i){
                // Styling here.
            });
            
            labels[0].innerHTML = "Player Names";
            labels[1].innerHTML = "Roll";
            labels[2].innerHTML = "Order";
            
            var current_players = [];
            
            peers.forEach(function(i){
                if(active_ids.indexOf(i.id)==-1) return;
                current_players.push(i);
                var our_row = player_table.insertRow(current_players.length);
                
                var fields = [our_row.insertCell(0), our_row.insertCell(1), our_row.insertCell(2)];
                fields.forEach(function(i){
                    i.style.backgroundColor = this._getActiveColor();
                }, this);
                
                fields[0].innerHTML = i.name;
                fields[1].innerHTML = "...";
                fields[2].innerHTML = "...";
                
                this._number_players++;
                
                
            }, this._players);
            
            popup.appendChild(player_table);
            
        }
        
        document.body.appendChild(popup);
        
    },

    "alert":function(a){alert(a);},
    
    enableDice:function(on_roll, z){
        var dice_button = document.getElementById('dice_button');
        dice_button.disabled = false;
        
        if(typeof on_roll == "function){
            on_roll.onclick = function(){
                on_roll(z);
                dice_button.disabled = true;
            }
        }
    }
    
    disableDice:function(){
        document.getElementById('dice_button').disabled = true;
    }
};

LandGrab.View = LandGrab.HTMLView;
