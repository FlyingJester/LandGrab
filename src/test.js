if(typeof LandGrab=="undefined")
    LandGrab = {};

function SetSomething(to){
    document.getElementById('this_will_change').innerHTML = to;
}

function SomethingChange(changed_to){
    TogetherJS.send({"type":"somethingChange", "changed_to":changed_to});
    SetSomething(changed_to);
}

TogetherJS.hub.on("somethingChange", function(msg){
    SetSomething(msg.changed_to);
});
