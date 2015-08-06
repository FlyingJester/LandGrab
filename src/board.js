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
    var board = JSON.parse(this.responseText);
    
    var board_element = document.getElementById("board");
    
    if(board.tiles.length%4){
        throw new RangeError("Number of tiles on the Board must be a multiple of 4");
    }
    
    var number_on_side = board.tiles.length/4;
    
    while(board_element.childNodes.length){
        board_element.childNodes[0].remove();
    }

    var transformations = [
        function(i){ i.y++; },
        function(i){ i.x--; },
        function(i){ i.y--; },
        function(i){ i.x++; }
    ];
    
    var which_transformation = 0;
    
    var position = {"x":number_on_side, "y":0};

    board.tiles.forEach(function(i, e){
        if((e % number_on_side) == 0){
            // Draw a corner.
        }
        
        // Create the space.
        {
            var space = document.createElement('div');
            space.style.position = "absolute";
            space.style.top = (position.y * board.tile_width)+"px";
            space.style.left = (position.x * board.tile_width)+"px";
            space.style.width =  board.tile_width+"px";
            space.style.height =  board.tile_width+"px";
            space.style.backgroundColor = LandGrab.GetRandomColor();
            space.className = 'space';
            board_element.appendChild(space);
        }
        
        e++;
        transformations[which_transformation](position);
        
        if((e % number_on_side) == 0)
            which_transformation++;
        
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
