var PreloadJS = {
    src:null,
    init:function(){
        var request = new XMLHttpRequest();
        request.responseType = "text";
        request.overrideMimeType("text/plain");
        
        request.open("get", "preload.json", true);
        
        
        request.onload = function(e){
            if(request.readyState===4){
                if(request.status==200){
                    PreloadJS.src = JSON.parse(request.responseText);
                    PreloadJS.load();
                }
                else{
                    console.error(request.statusText);
                    console.log("Preload failure");
                }
            }
            else{
                console.log("Preload not ready");
            }
        }
        
        request.send();

    },
    load:function(){

        elements = new Array(this.src.length);

        this.src.forEach(function(i, e){
            var type = i.type;

            if(!type) type = "img";
            
            console.log("Preloading object " + i.src);
            
            var element = document.createElement(i.type);
            if(type=="img")
                element.src = i.src;

            element.style.display = "none";            
        });

    }
};

PreloadJS.init();
