var scrumwall = DUI.Class.create(true);

//guid for items 
var itemCount = 0;
var eventPropagationStopped = false;

function isEventPropagationStopped() {
	if(eventPropagationStopped) {
		eventPropagationStopped = false;
		return true;
	}
	return false;
}


function stopEventPropagation() {
	eventPropagationStopped = true;
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
	for (i in map) {
		scrumwall[object].prototype[i] = map[i];
	}
}