var scrumwall = DUI.Class.create(true);

//guid for items 
var itemCount = 0;

function map(source, destination) {
	for(var i in source) {
		destination[i] = source[i];
	}
}

function exceptionHandler(msg){
	var el = $("#errorHandler");
	$(el).text("The server says: " + msg);
	$(el).dialog({ buttons: { "Ok": function() { $(this).dialog("destroy"); }}});	
}

function New(clazz, config, options){
	if(!scrumwall[clazz]) {
		throw "I don't think this \"class\" exists: " + clazz;
	}
	
	var instance = $.create("div",{"class":clazz});
	$.extend( instance, new scrumwall[clazz]() );
	instance.initialize(config, options);	
	return instance;
}

function create(object,map){
	createExtending(object,map);
}

function createExtending(object, parent, map) {
	scrumwall.create(object, {});
	if(map){
		scrumwall[object].prototype = new scrumwall[parent];
	}else{
		map = parent;
		
	}
	scrumwall[object].prototype.supr = {};
	for (var i in map) {
		if(scrumwall[object].prototype[i]) {
			scrumwall[object].prototype.supr[i] = scrumwall[object].prototype[i];
		}
		scrumwall[object].prototype[i] = map[i];
	}
}

function count(object){
    var count=0,
        property;
    for (property in object){
        if (object.hasOwnProperty(property)){
            count++;
        }
    }
    return count;
}