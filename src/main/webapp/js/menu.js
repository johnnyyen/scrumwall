create("menu",{
	NAME_TEXT: "My name",
	
	init:function(layout){
	
		this.layout = layout;
		this.owner = $("#ownerInput");
		this.owner.val(this.NAME_TEXT);
		this.owner.bind("focus",{}, this.clearOwner, this);
		this.owner.bind("blur", {}, this.onOwnerBlur, this);
		
		$(".sector").draggable({helper: 'clone'});
		var creator = $("#itemCreator");
		
		this.ucb = $("#ucbButton");
		this.goals = $("#goalsButton");
		this.impediments = $("#impedimentsButton");
		
	},
	clearOwner:function(){
		var owner = $(this.owner);
		if(owner.val() == this.NAME_TEXT) {
			owner.val("");
		}
		owner.select();
	},
	onOwnerBlur:function(){
		var name = $.trim($(this.owner).val());
		if(name == ""){
			$(this.owner).val(this.NAME_TEXT);
		}else if(name != this.NAME_TEXT){
			$(this.owner).addClass("changed");
		} else {
			$(this.owner).removeClass("changed");
		}
		
	}
});