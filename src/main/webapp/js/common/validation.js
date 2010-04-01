function isValidNumber(value){
	return /^\d{0,2}$/.test(value);	
}

function validateNumber(element){
	if(isValidNumber($(element).val())){
		$(element).qtip("destroy")
		return true;
	}else{
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
				content:"This needs to be a number", 
				show: false, 
				hide: {
					delay: 1000, 
					effect:{type:"fade"}, 
					when: { event: "inactive"}
				},
				api: { onHide : function() { $(element).qtip("destroy")}}
			}
		);
		
		$(element).qtip("show");
		setTimeout(function(){$(element).qtip("hide")}, 3000);
		return false;
	}
}
