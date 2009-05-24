scrumwall.create("layout", {
	itemCount:0,
	init: function(config){
		$("#newItem").click(function(ev){alert("button clicked");});
		$("#tabbar").tabs();
		var menu = new scrumwall.menu();
		
		$("#itemCreator").bind("click",{owner:$(menu.owner)},this.createItem);
		var creator = $("#itemCreator");
		creator.itemCount = 0;
		
		this.config = config;
		this.createColumns($("#columnContainer"));
		
		$(window).bind("resize",{cols:this.cols},this.onWindowResize);
	},
	createColumns:function(parentEl){
		//get column area width
		var width = $(parentEl).width();
		var colwidth = Math.round(width/config.columns)-2;
		this.cols = new Array();
		for(var i=0; i < config.columns; i++){
			this.cols[this.cols.length] = new scrumwall.column(colwidth, "col"+i, parentEl);
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
		var owner = event.data.owner;
		var defaultOwner = $(owner).attr("value");
		if(defaultOwner == "Your name"){
			defaultOwner =  "";
		}
		var item = new scrumwall.item(event.target, itemCount++, defaultOwner);
		
	}
});


