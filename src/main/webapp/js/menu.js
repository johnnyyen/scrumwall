scrumwall.create("menu",{
	init:function(){
		this.owner = $("#ownerInput");
		this.owner.focus(this.clearOwner);
		this.owner.blur(this.onOwnerBlur);
		this.ucb = $("#ucbButton");
		this.ucbDrawer = newDrawer({button: this.ucb});
		
		
	},
	clearOwner:function(){
		
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