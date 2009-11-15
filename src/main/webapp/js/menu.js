create("menu",{
	NAME_TEXT: "My name",
	DRAWERTYPES: {
		UCB: "UCB",
		GOALS: "GOALS",
		IMPEDIMENTS: "IMPEDIMENTS"
	},
	init:function(layout){
	
		this.layout = layout;
		this.owner = $("#ownerInput");
		this.owner.val(this.NAME_TEXT);
		this.owner.bind("focus",{}, this.clearOwner, this);
		this.owner.bind("blur", {}, this.onOwnerBlur, this);
		
		this._initDrawers();
		
		$(".sector").draggable({helper: 'clone'});
		var creator = $("#itemCreator");
	},
	_initDrawers: function() {
		this.drawers = new Array();
		
		this.ucb = $("#ucbButton");
		this.drawers[-1] = (New("drawer", {layout: this.layout, drawerType: this.DRAWERTYPES.UCB,
				button: this.ucb, id: -1, menu: this, color: "green"}));
		
		this.goals=$("#goalsButton");
		this.drawers[-2] = (New("drawer", {layout: this.layout, drawerType: this.DRAWERTYPES.GOALS,
				button: this.goals, id: -2, menu: this, color: "pink"}));
		
		this.impediments = $("#impedimentsButton");
		this.drawers[-3] = (New("drawer", {layout: this.layout, drawerType: this.DRAWERTYPES.IMPEDIMENTS,
				button: this.impediments, id: -3, menu: this, color: "yellow"}) );
	},
	clearOwner:function(){
		$(this.owner).select();
	},
	onOwnerBlur:function(){
		if($.trim($(this.owner).val()) != this.NAME_TEXT){
			$(this.owner).addClass("changed");
		}
		
	},
	saveAllDrawers: function() {
		for(var i in this.drawers){
			this.drawers[i].saveItems();
		}
	},
	collapseDrawers:function(openDrawer){
		for(var i in this.drawers){
			if(this.drawers[i].expanded){
				$(this.drawers[i].button).click();
			}
		}
	},
	isDrawerExpanded: function(){
		for(var i in this.drawers){
			if(this.drawers[i].drawerExpanded()){
				return true;
			}
		}
		return false;
	}
});