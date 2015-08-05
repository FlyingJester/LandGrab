if(typeof LandGrab=="undefined")
    LandGrab = {};

LandGrab.LoadBoard = function(board_name){
    if(typeof board_name=="undefined")
        board_name = "board.json";
    else if(typeof board_name!="string") 
        throw new TypeError("Argument 0 must be a string");
    
    var board_request = new XMLHttpRequest();
    board_request.responseType = "text";
    board_request.overrideMimeType("text/plain");
    
    board_request.open("get", board_name, false);
    board_request.send();
    
    LandGrab.board = JSON.parse(board_request.responseText);
    
}
