var scrumwall = DUI.Class.create(true);

//guid for items 
var itemCount = 0;

function exceptionHandler(msg){
	var el = $("#errorHandler");
	$(el).text("The server says: " + msg);
	$(el).dialog({ buttons: { "Ok": function() { $(this).dialog("destroy"); }}});	
}
function newItem(config, columns){
	var item = $.create("div",{"class":"item"});
	$.extend( item, new scrumwall.item() );
	item.initialize(config, columns);	
	return item;
}