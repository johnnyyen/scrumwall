scrumwall.create("layout", {
	itemCount:0,
	init: function(){
		$("#newItem").click(function(ev){alert("button clicked");});
		$("#tabbar").tabs();
		this.menu = new scrumwall.menu();
		
		//$("#itemCreator").bind("click",{owner:$(this.menu.owner)},this.createItem);
		$(".sector").draggable({helper: 'clone'});
		var creator = $("#itemCreator");
		creator.itemCount = 0;
		
		ColumnService.getColumns({scope: this, callback: this.createColumns, exceptionHandler:exceptionHandler});
		
		$(window).bind("resize", {cols:this.cols}, this.onWindowResize);
		$("#trashcan").droppable({drop:this.onItemDelete, tolerance:"touch"});
	},
	loadItems:function(items){
		
		var item;
		
		for(var i = 0; i < items.length; i++){
			item = newItem(items[i], this.cols);
			var n=0;
			
		}
	},
	createColumns:function(columns){
		var parentEl = $("#columnContainer");
		//get column area width
		var width = $(parentEl).width();
		var colWidth = Math.round(width/columns.length)-2;
		this.cols = new Array();
		for(var i=0; i < columns.length; i++){
			var col = jQuery.create("div",{"class":"column"});
			$.extend( col, new scrumwall.column() );
			columns[i].colWidth = colWidth;
			columns[i].parentEl = parentEl;
			col.initialize(columns[i]);
			this.cols[this.cols.length] = col;
		}

		ItemService.getForSprint(1, {scope: this, callback:this.loadItems, exceptionHandler:exceptionHandler});		
	},
	onWindowResize:function(event){
		var cols = event.data.cols;	
		var width = $("#columnContainer").width();
		var colWidth = Math.round(width/cols.length)-2;
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
		var config = {parentEl:event.target,
			owner:defaultOwner};
		itemCount++;
		var item = newItem(config,null);
		
	},
	onItemDelete:function(event, ui){
		ui.draggable[0].remove();
	}
});


