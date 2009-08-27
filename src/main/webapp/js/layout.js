create("layout", {
	itemCount:0,
	init: function(){
		$("#newItem").click(function(ev){alert("button clicked");});
		$("#tabbar").tabs();
		this.menu = new scrumwall.menu();
		
		//$("#itemCreator").bind("click",{owner:$(this.menu.owner)},this.createItem);
		$(".sector").draggable({helper: 'clone'});
		var creator = $("#itemCreator");
		creator.itemCount = 0;
		
		ColumnService.getColumns({async:false, scope: this, callback: this.createColumns, exceptionHandler:exceptionHandler});
		
		$(window).bind("resize", {}, this.onWindowResize, this);
		$(window).bind("beforeunload", {},this.onPageUnload, this);
		$(this).bind("columnResize",{}, this.onColumnResize, this);
		$("#trashcan").droppable({drop:this.onItemDelete, tolerance:"touch"});
	},
	loadItems:function(items){
		
		var item;
		
		for(var i = 0; i < items.length; i++){
			item = New("item", items[i], this.columns);
			var n=0;
			
		}
	},
	createColumns:function(columns){
		var parentEl = $("#columnContainer");
		//get column area width
		var width = $(parentEl).width();
		var colWidth = Math.round(width/columns.length)-10;
		this.columns = new Array();
		for(var i=0; i < columns.length; i++){
			columns[i].colWidth = colWidth;
			columns[i].parentEl = parentEl;
			columns[i].menu = this.menu;
			columns[i].layout = this;
			var col = New("column", columns[i]);
			this.columns[columns[i].id] = col;
		}

		ItemService.getForSprint(1, {scope: this, callback:this.loadItems, exceptionHandler:exceptionHandler});		
	},
	onWindowResize:function(event){
		
		var width = $("#columnContainer").width();
		var colWidth = Math.round(width/this.columns.length)-2;
		for(var i = 0; i < this.columns.length; i++){
			this.columns[i].columnResize(colWidth);
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
		var item = New("item", config);
		
	},
	onItemDelete:function(event, ui){
		ui.draggable[0].remove();
	},
	onPageUnload: function(event){
		//FIXME: always saves all items when unloading page
		for(var i in this.columns){
			this.columns[i].saveItems();
		}
		for(var i in this.menu.drawers){
			this.menu.drawers[i].saveItems();
		}
	},
	columnsOnRightCount:function(myOrder){
		var count = 0;
		for(var i in this.columns){
			if(this.columns[i].order > myOrder){
				count++;
			}
		}
		
		return count;
	},
	onColumnResize: function(order, delta){
		var count = this.columnsOnRightCount(order);
		var change = ( ( (delta) / count) * (-1) );
		for(var i in this.columns){
			if(this.columns[i].order > order){
				var width = $(this.columns[i]).width() + change;
				this.columns[i].columnResize(width);
			}
		}
	}
});


