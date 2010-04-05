/**
 * Copyright 2009,2010 Silver Juurik, Heiti Allak
 */
 
function isValidNumber(value){
	return /^\d{0,2}$/.test(value);	
}

function validateNumber(element){
	if(isValidNumber($(element).val())){
		hideTooltip(element);
		return true;
	}else{
		showTooltip(element, "Only numeric values are accepted")
		return false;
	}
}
