scrumwall.create("layout", {
	itemCount:0,
	init: function(config){
		$("#newItem").click(function(ev){alert("button clicked");});
		$("#tabbar").tabs();
		this.menu = new scrumwall.menu();
		
		$("#itemCreator").bind("click",{owner:$(this.menu.owner)},this.createItem);
		var creator = $("#itemCreator");
		creator.itemCount = 0;
		
		this.config = config;
		this.createColumns($("#columnContainer"));
		
		ItemService.getForSprint(1, {scope: this, callback:this.loadItems, exceptionHandler:exceptionHandler});
		
		$(window).bind("resize",{cols:this.cols},this.onWindowResize);
	},
	loadItems:function(items){
		
		var item;
		
		for(var i = 0; i < items.length; i++){
			item = newItem(items[i], this.cols);
			var n=0;
			
		}
	},
	createColumns:function(parentEl){
		//get column area width
		var width = $(parentEl).width();
		var colwidth = Math.round(width/config.columns)-2;
		this.cols = new Array();
		for(var i=0; i < config.columns; i++){
			var id = "col"+i;
			var col = jQuery.create("div",{"class":"column","id":id});
			$.extend( col, new scrumwall.column() );
			col.initialize(colwidth, id, parentEl);
			this.cols[this.cols.length] = col;
		}
		
	},
	onWindowResize:function(event){
		var cols = event.data.cols;	
		var width = $("#columnContainer").width();
		var colWidth = Math.round(width/config.columns)-2;
		for(var i = 0; i < cols.length; i++){
			cols[i].resize(colWidth);
		}
	},
	createItem:function(event){
		//FIXME fix sprint id
		var FIX_SPRINT_ID=1;
		var owner = event.data.owner;
		var defaultOwner = $(owner).attr("value");
		if(defaultOwner == "Your name"){
			defaultOwner =  "";
		}
		var config = {parentEl:event.target,
			id:itemCount,
			owner:defaultOwner,
			sprintId:FIX_SPRINT_ID};
		itemCount++;
		var item = newItem(config,null);
		
	}
});


