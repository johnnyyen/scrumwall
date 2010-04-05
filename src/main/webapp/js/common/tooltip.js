/**
 * Copyright 2009,2010 Silver Juurik, Heiti Allak
 */
 
function showTooltip(element, message){
	$(element).qtip({
			position: {
				corner: { 
					target: "rightMiddle", 
					tooltip: "leftMiddle"
				}
			}, 
			style: {
				tip: "leftMiddle"
			}, 
			content: message, 
			show: {
				when: { event: "showTooltip"}
				
			}, 
			hide: {
				delay: 5000,
				when: { event: "inactive"}
			},
			api: { onHide : function() { $(element).qtip("destroy")}}
		}
	);
	
	$(element).trigger("showTooltip");
}

function hideTooltip(element){
	if( $(element).data('qtip') ){
		$(element).qtip("hide");
		$(element).qtip("destroy");
	}
}