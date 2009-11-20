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
		$(this.owner).select();
	},
	onOwnerBlur:function(){
		if($.trim($(this.owner).val()) != this.NAME_TEXT){
			$(this.owner).addClass("changed");
		}
		
	}
});