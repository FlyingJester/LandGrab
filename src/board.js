if(typeof LandGrab=="undefined")
    LandGrab = {};

LandGrab.board = null;

LandGrab.GetRandomColor = function(){
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for(var i = 0; i < 6; i++){
        color += letters[((Math.random() * 6)>>0) + ((Math.random() * 10)>>0)];
    }
    return color;
}

LandGrab.OnBoardLoad = function(){
    LandGrab.board = JSON.parse(this.responseText);
    var board = LandGrab.board;
    
    var board_element = document.getElementById("board");
    
    if(board.tiles.length%4){
        throw new RangeError("Number of tiles on the Board must be a multiple of 4");
    }
    
    var number_on_side = board.tiles.length/4;
    
    while(board_element.childNodes.length){
        board_element.childNodes[0].remove();
    }
    
    // One for each of the sides of the board
    var transformations = [
        function(i){ i.y++; },
        function(i){ i.x--; },
        function(i){ i.y--; },
        function(i){ i.x++; }
    ];
    
    var space_classes = [
        "right_side_space",
        "bottom_side_space",
        "left_side_space",
        "top_side_space"
    ];

    var sizes = [
        {"w":board.tile_height, "h":board.tile_width },
        {"w":board.tile_width,  "h":board.tile_height},
        {"w":board.tile_height, "h":board.tile_width },
        {"w":board.tile_width,  "h":board.tile_height}    
    ];
    
    var which = 0;
    var position = {"x":number_on_side, "y":0};
    var max_position = {"x":0, "y":0};
    
    var corner_offset = (board.tile_height-board.tile_width);
    
    board.tiles.forEach(function(i, e){
        
        // Create the space.
        {
            var space = document.createElement('div');
            space.style.position = "absolute";
            space.style.top = (position.y * board.tile_width+((position.y)?corner_offset:0))+"px";
            space.style.left = (position.x * board.tile_width+((position.x)?corner_offset:0))+"px";
            if((e % number_on_side) == 0){
                // Draw a corner.
                space.style.width =  board.tile_height+"px";
                space.style.height =  board.tile_height+"px";
            }
            else{
                // Just a space.
                space.style.width =  sizes[which].w + "px";
                space.style.height =  sizes[which].h + "px";
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
            board_element.appendChild(space);
            
            var space_title = document.createElement('p');
            //space_title.className = space_classes[which];
            space_title.innerHTML = i.name;
            space_title.style.textAlign ="center";
            space.appendChild(space_title);
        }
        
        e++;
        transformations[which](position);
        
        max_position.y = Math.max(position.y, max_position.y);
        max_position.x = Math.max(position.x, max_position.x);
        
        if((e % number_on_side) == 0)
            which++;
        
    });
    
}

LandGrab.LoadBoard = function(board_name){
    if(typeof board_name=="undefined")
        board_name = "board.json";
    else if(typeof board_name!="string") 
        throw new TypeError("Argument 0 must be a string");
    
    var board_request = new XMLHttpRequest();
    board_request.responseType = "text";
    board_request.overrideMimeType("text/plain");
    
    board_request.open("get", board_name, true);
    
    board_request.onload = LandGrab.OnBoardLoad;
    
    board_request.send();

}

//TODO: For testing purposes!
LandGrab.LoadBoard("data/board1.json");
