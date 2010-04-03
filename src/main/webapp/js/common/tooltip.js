
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