if(typeof LandGrab=="undefined")
    LandGrab = {};

LandGrab.board = null;

LandGrab.OnBoardLoad = function(){
    LandGrab.board = JSON.parse(this.responseText);
    var board = LandGrab.board;
    
    if(board.tiles.length%4){
        throw new RangeError("Number of tiles on the Board must be a multiple of 4");
    }
    
    LandGrab.View.clearBoard();
    
    LandGrab.View.drawBoard(board);
 
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
