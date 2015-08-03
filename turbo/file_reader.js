///////////////////////////////////////////////////////////////////////////////
/* Copyright (c) 2015 Martin McDonough
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgement in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 *
 */
///////////////////////////////////////////////////////////////////////////////

if(typeof Turbo == "undefined")
    var Turbo = {}

Turbo.SEEK_SET = 0;
Turbo.SEEK_CUR = 1;
Turbo.SEEK_END = 2;

// A stream object is defined as such:
/*
Namespace.StreamType = function(input, offset){
    if(typeof offset == "undefined")
        offset = 0;
    // Implement this.size();
    // Implement this.read(num); // Can return a ByteArray or an Array
    // Implement this.getByte();
    // Implement this.getWord();
    // Implement this.getDWord();
    // Implement this.seek(to, whence);
    // Implement this.tell();
    // Implement this.slice(from, to); // Can return a ByteArray or an Array
    this.getChar = this.getByte;
    this.getShort = this.getWord;
    this.getInt   = this.getDWord;
    this.getLongLong = this.getQWord;
}
*/

// Constructs a stream from an Array or a ByteArray.
Turbo.ArrayReader = function(input, offset){

    if(typeof offset == "undefined")
        offset = 0;

    this.guts = input;
    this.at = offset;

    // Implement this.size();
    if(typeof this.guts.length != "undefined")
        this.size = function(){return this.guts.length;};
    else if(typeof this.guts.byteLength != "undefined")
        this.size = function(){return this.guts.byteLength;};
    else if(typeof this.guts.byteLength != "undefined")
        this.size = function(){return this.guts.byteLength;};
    else
        throw "No known way to determine length of input.";

    // Implement this.read(num); // Can return a ByteArray or an Array
    this.read = function(num){
        var to = this.at+num;
        return this.guts.slice(this.at, to);
        this.at = to;
    }

    // Implement this.getByte();
    this.getByte = function(){
        return this.guts[this.at++];
    }

    // Implement this.getWord();
    this.getWord = function(){
        return Turbo.dByteCat(this.guts[this.at++], this.guts[this.at++]);
    }

    // Implement this.getDWord();
    this.getDWord = function(){
        return Turbo.qByteCat(this.guts[this.at++], this.guts[this.at++], this.guts[this.at++], this.guts[this.at++]);
    }

    // Implement this.seek(to, whence);
    this.seek = function(to, whence){

        if(typeof whence == "undefined")
            whence = Turbo.SEEK_SET;

        switch(whence){
        case Turbo.SEEK_SET:
                if(to>this.size())
                    throw "Invalid seek. Tried to seek to " + to + ", maximum possible is " + this.size();
                this.at = offset + to;
            break;
            case Turbo.SEEK_CUR:
                if(to>this.size()-this.at)
                    throw "Invalid seek. Tried to seek to " + to + ", maximum possible is " + this.size()-this.at;
                this.at += to;
            break;
            case Turbo.SEEK_END:
                if(to>this.size())
                    throw "Invalid seek. Tried to seek to " + to + ", maximum possible is " + this.size();
                this.at = offset+this.size()-to;
            break;
            default:
                throw "Argument two must be Turbo.SEEK_SET, Turbo.SEEK_CUR, or Turbo.SEEK_END.";
        }
        return this.tell();
    }


    // Implement this.slice(from, to); //< Return value must have [] operator.
    this.slice = function(from, to){return this.guts.slice(from, to);};

    // Implement this.tell();
    this.tell = function(){return this.at;};

    // Aliases
    this.getChar = this.getByte;
    this.getShort = this.getWord;
    this.getInt   = this.getDWord;
    this.getLongLong = this.getQWord;

}

Turbo.URLStream = function(request){
    this.url = request.url;
    this.get = function(){
        
        if((!request) || (!request.buffer)){
            alert("Could not load file " +this.url);
            request = null;
            return request;
        }
        
        return new Turbo.ArrayReader(request.buffer);
        
    }
}

Turbo.URLAsStream = function(url){

    var url_request = new XMLHttpRequest();
    url_request.open("GET", url, false);
    url_request.responseType = "arraybuffer";

    var buffer = null;

    url_request.onload = function(event){
        buffer = url_request.response;
    }

    url_request.send(null);
    
    return new Turbo.URLStream({"request":url_request, "buffer":buffer, "url":url});

}

// Constructs a stream
Turbo.Stream = function(input, offset){

    if(typeof offset == "undefined")
        offset = 0;

    if(((typeof Uint8Array == "function") && (input instanceof Uint8Array)) || (Array.isArray(input))){
        var reader = new Turbo.ArrayReader(input, offset);
    }
    else{
        var reader = new Turbo.FileReader(input, offset);
    }

    if(typeof reader != "undefined"){
        for(var i in header){
            this[i] = header[i];
        }
    }

    if(!((typeof this.size == "function")
     &&  (typeof this.read == "function")
     &&  (typeof this.getByte == "function")
     &&  (typeof this.getWord == "function")
     &&  (typeof this.getDWord == "function")
     &&  (typeof this.seek == "function")
     &&  (typeof this.tell == "function")
     &&  (typeof this.slice == "function")))
        throw "Did not create a working Reader object. Types :" + typeof this.size + typeof this.read + typeof this.getByte + typeof this.getWord + typeof this.getDWord + typeof this.seek + typeof this.tell + typeof this.slice;

}
