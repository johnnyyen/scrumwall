scrumwall.create("menu",{
	init:function(){
		this.owner = $("#ownerInput");
		this.owner.focus(this.clearOwner);
		this.owner.blur(this.onOwnerBlur);
		
		this.drawers = new Array();
		
		this.ucb = $("#ucbButton");
		this.drawers.push(newDrawer({button: this.ucb, id: -1, menu: this, color: "green"}));
		
		this.goals=$("#goalsButton");
		this.drawers.push(newDrawer({button: this.goals, id: -2, menu: this, color: "pink"}));
		
		this.impediments = $("#impedimentsButton");
		this.drawers.push( newDrawer({button: this.impediments, id: -3, menu: this, color: "yellow"}) );
		
		this.eventPropagationStopped = false;
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
		
	},
	collapseDrawers:function(openDrawer){
		for(var i in this.drawers){
			if(this.drawers[i].expanded){
				$(this.drawers[i].button).click();
			}
		}
	}
});