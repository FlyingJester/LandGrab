var PreloadJS = {
    src:null,
    init:function(){
        var request = new XMLHttpRequest();
        request.responseType = "text";
        request.overrideMimeType("text/plain");
        
        request.open("get", "preload.json", false);
        request.send();
        
        this.src = JSON.parse(request.responseText);

    },
    load:function(){

        elements = new Array(src.length);

        src.forEach(function(i, e){
            var type = i.type;

            if(!type) type = "img";

            var element = document.createElement(i.type);
            if(type=="img")
                element.src = i.src;

            element.style.display = "none";            
        });

    }
};

PreloadJS.init();
PreloadJS.load();
