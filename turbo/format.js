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
    var Turbo = {};

if(typeof Turbo.Classic == "undefined")
    Turbo.Classic = {};

/*///////////////////////////////////////////////////////////////////////////*/
//                 Decode Binary Files Based on a JSON Scheme                //
/*///////////////////////////////////////////////////////////////////////////*/

Turbo.dByteCat = function(first, second){
    return (first) | (second<<8);
}

Turbo.qByteCat = function(first, second, third, fourth){
    return (Turbo.dByteCat(third, fourth) << 16) | Turbo.dByteCat(first, second)
}

// Remember to increment the cursor by length.
// Length includes the size value.
Turbo.Classic.readString = Turbo.Classic.readString || function(array, at){

    if(array.length<at)
      throw "Unexpected end of file."

    var len = Turbo.dByteCat(array[at++], array[at++]);

    if(array.length<at+len)
      throw "Unexpected end of file.";

    var str = array.slice(at, at+len);

    var string = CreateStringFromByteArray(str);

    return {length:len+2, string:string};

}

Turbo.LoadURLScheme = function(name){
    var url_request = new XMLHttpRequest();
    url_request.open("GET", "formats/" + name, false);
    url_request.overrideMimeType("text/plain");
    
    var buffer = null;

    url_request.onload = function(event){
        buffer = url_request.response;
    }
    
    var scheme;
    
    url_request.onload = function(event){
        scheme = url_request.responseText;
    }

    url_request.send(null);
    
    return JSON.parse(scheme);
}

Turbo.LoadSystemScheme = function(name){

    if(typeof alert == "function"){
        alert("Calling LoadSystemScheme in web environment. This will all end in tears.");
        return Turbo.LoadURLScheme(name);
    }

    var scheme_file = new RawFile("#~/formats/"+name);
    var scheme = scheme_file.readString();

    return JSON.parse(scheme);
}

Turbo.GetSchemeLength = function(scheme){
    var s = 0;
    scheme.forEach(function(i){s += i.size;});
    return s;
}

Turbo.AddSchemeElementToObject = function(element, object, reader){

    if(element.size > reader.size() - reader.tell())
        throw "Unexpected end of file. Element " + element + " (" + element.name + ") needs " + element.size + " bytes at offset " + reader.tell() + ", but the file is only " + reader.tell() + " bytes long.";

    if(element.type=="number"){
        if(element.size==1)
            object[element.name] = reader.getByte();
        else if(element.size==2)
            object[element.name] = reader.getWord();
        else if(element.size==4)
            object[element.name] = reader.getDWord();
        else
            throw "Invalid number size of " + element.size + " for element '" + element.name + "'";
    }
    else if(element.type=="flag"){
        if(element.size!=1)
            throw "Flag of size " + element.size + ", only flags of size 1 supported.";
        object[element.name] = !(!(reader.getByte()));
    }
    else if(element.type=="string"){

        var len = reader.getWord();

        object[element.name] = CreateStringFromByteArray(reader.read(len));

    }
    else if(element.type=="fixed_string"){
        object[element.name] = CreateStringFromByteArray(reader.read(element.size));
    }
    else if(element.type=="float"){
        alert("Invalid format");
    }
    else{
        reader.seek(element.size, Turbo.SEEK_CUR);
    }
}

Turbo.ReadBinaryObject = function(from, scheme){

    var scheme_length = Turbo.GetSchemeLength(scheme);

    if(!(from.size()-from.tell() >= scheme_length))
        throw "Unexpected end of input.";

    var obj = {string_length:0};

    scheme.forEach(function(i){Turbo.AddSchemeElementToObject(i, obj, from);});

    return obj;

}