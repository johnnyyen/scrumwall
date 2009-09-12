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
		this.columnContainer = $("#columnContainer");
		var scope = this;
		this.columnContainer.sortable({
			items: '.column',
			handle : '.colHeader',
			containment: 'parent',
		    scroll: false,
		    revert: true,
		    tolerance: "intersect",
		    update : function (event, ui) { 
		    	//FIXME: move from inline function to a separate one
				var columns = $(scope.columnContainer).children();
				var order = 0;
				
				for(var i = 0; i < columns.length; i++){
					columns[i].order = order;
					order++;
				}
		    } 
		  });
		
		this.containerWidth = this.columnContainer.width();
		this.containerHeight = this.columnContainer.height();
	},
	loadItems:function(items){
		
		var item;
		
		for(var i = 0; i < items.length; i++){
			item = New("item", items[i], this.columns);
			var n=0;
			
		}
	},
	createColumns:function(columns){
		var parentEl =  $("#columnContainer");
		//get column area width
		var width = $(parentEl).width();
		var colWidth = Math.round(width/columns.length)-10;
		this.columns = new Array();
		for(var i=0; i < columns.length; i++){
			columns[i].colWidth = colWidth;
			columns[i].parent = parentEl;
			columns[i].menu = this.menu;
			columns[i].layout = this;
			var col = New("column", columns[i]);
			this.columns[columns[i].id] = col;
		}

		ItemService.getForSprint(1, {scope: this, callback:this.loadItems, exceptionHandler:exceptionHandler});		
	},
	createColumn:function(event){
		var parentEl =  $("#columnContainer");
		
		this.onColumnResize(-1,150);
		
		var config = {layout: this, parent: parentEl};
		var column = New("column",config);
		
		$('.doneColumn').before($(column));
		
		this._updateColumnOrders();
		
		
		column.save();
		//this.columns[]=column;
	},
	_updateColumnOrders:function(){
		var columns = $(this.columnContainer).children();
		var order = 0;
		
		for(var i = 0; i < columns.length; i++){
			columns[i].order = order;
			order++;
		}
	},
	onWindowResize:function(event){
		
		var width = $("#columnContainer").width();
		var height=$("#columnContainer").height();
		var widthDelta = this.containerWidth - width;
		this.containerWidth = width;
		var heightDelta = height - this.containerHeight;
		this.containerHeight = height;
		this.onColumnResize(-1,widthDelta, heightDelta);
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
	onColumnResize: function(order, widthDelta, heightDelta){
		var count = this.columnsOnRightCount(order);
		var change = ( ( (widthDelta) / count) * (-1) );
		var newHeight = $(this.columns[0]).height() + heightDelta;

		for(var i in this.columns){
			var newWidth = 0;
			
			if(this.columns[i].order > order){
				newWidth = $(this.columns[i]).width() + change;
			}
			
			this.columns[i].columnResize(newWidth, newHeight);
		}
	}
});


