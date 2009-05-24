scrumwall.create("menu",{
	init:function(){
		this.owner = $("#ownerInput");
		this.owner.focus(this.clearOwner);
		this.owner.blur(this.onOwnerBlur);
	},
	clearOwner:function(){
		//this == ownerInput
		
		if(!$(this).attr("value") || $(this).attr("value") == "Your name"){
			$(this).removeAttr("value");
		}
	},
	onOwnerBlur:function(){
		if(!$(this).attr("value") || $(this).attr("value").length == 0){
			$(this).attr("value","Your name");
		}
		
	}
});