create("layout", {
	itemCount:0,
	init: function(){
		$("#newItem").click(function(ev){alert("button clicked");});
		$("#tabbar").tabs();
		this.menu = new scrumwall.menu();
		this.columnContainer = $("#columnContainer");
		
		//$("#itemCreator").bind("click",{owner:$(this.menu.owner)},this.createItem);
		$(".sector").draggable({helper: 'clone'});
		var creator = $("#itemCreator");
		creator.itemCount = 0;
		
		ColumnService.getColumns(this.getCurrentSprint(), {async:false, scope: this, callback: this.createColumns, exceptionHandler:exceptionHandler});
		
		$(window).bind("resize", {}, this.onWindowResize, this);
		$(window).bind("beforeunload", {},this.onPageUnload, this);
		$(this).bind("columnResize",{}, this.onColumnResize, this);
		$("#trashcan").droppable({drop:this.onItemDelete, tolerance:"touch"});
		var scope = this;
		this.columnContainer.sortable({
			items: '.sortableColumn',
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
				scope.saveAllColumns();
		    } 
		  });
		
		this.containerWidth = this.columnContainer.width();
	},
	loadItems:function(items){		
		var item;		
		for(var i = 0; i < items.length; i++){
			item = New("item", items[i], this.columns);		
		}
	},
	createColumns:function(columns){
		var parentEl =  $("#columnContainer");
		
		var width = $(parentEl).width();

		this.columns = new Array();
		for(var i=0; i < columns.length; i++){
			columns[i].parent = parentEl;
			columns[i].menu = this.menu;
			columns[i].layout = this;
			var col = New("column", columns[i]);
			this.columns[columns[i].id] = col;
		}
		this.setColumnWidths();

		ItemService.getForSprint(this.getCurrentSprint(), {scope: this, callback:this.loadItems, exceptionHandler:exceptionHandler});		
	},
	setColumnWidths: function(){
		var remainder = 0;
		var pixels = 0;
		var totalPixels = this.columnContainer.width();
		var counter = 1;
		for(var i in this.columns ){
			if(counter == this.columns.__count__) {
				this.columns[i].columnWidth = Math.floor(totalPixels)-1;
				pixels = Math.floor(totalPixels)-1
			}else{
				var size = this.columns[i].width*this.columnContainer.width()/100 + remainder;
				pixels = Math.floor(size);
				totalPixels -= pixels;
				remainder = size - pixels;
				this.columns[i].columnWidth = pixels;
			}
			this.columns[i].jq.width( pixels )
			counter++;
		}
	},
	createColumn: function(event){
		var defaultWidth = 150;
		this.resizeOnColumnAdd(defaultWidth);
		
		var config = {layout: this, parent: this.columnContainer};
		config.width = defaultWidth / this.columnContainer.width() * 100;
		var column = New("column",config);		
		$('.doneColumn').before($(column));
		column.jq.width(defaultWidth);
		this.redraw();
		
		this._updateColumnOrders();
		
		this.columns["new"]=column;
		
		this.onResizeStop();
		
		delete this.columns["new"];
		this.columns[column.guid] = column;
	},
	onResizeStop: function(){
		var remainder = 0;
		var percentage = 0;
		var totalPercentage = 100;
		var counter = 1;
		for(var i in this.columns ){
			if(counter == this.columns.__count__) {
				this.columns[i].width = Math.floor(totalPercentage * 100) / 100;
			}else{
				var size = this.columns[i].jq.width()/this.columnContainer.width()*100 + remainder;
				percentage = Math.floor(size*100)/100;
				totalPercentage -= percentage;
				remainder = size - percentage;
				this.columns[i].width = percentage;
			}
			counter++;
		}
		
		this.saveAllColumns();
	},
	saveAllColumns: function() {
		for(var i in this.columns){
			if(i) {
				this.columns[i].save();
			}
		}
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
		
		var width = this.columnContainer.width();
		var widthDelta = this.containerWidth - width;
		this.containerWidth = width;
		this.onColumnResize(-1,widthDelta);
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
	onColumnResize: function(order, widthDelta){
		console.log(widthDelta)
		widthDelta *= (-1)
		if(Math.abs(widthDelta) > 10){
			this.onColumnLargeResize(order);
		}else{
			this.onColumnSmallResize(order);
		}
	},
	onColumnSmallResize: function(order){
		var weight = 0;
		var random = Math.random();
		
		var totalColumnSize = 0;
		var totalWidth = this.columnContainer.width();
		for(var i in this.columns){
			if(this.columns[i].order <= order){
				totalWidth -= this.columns[i].jq.width();
			}
			totalColumnSize += this.columns[i].jq.width();
		}
		var widthDelta = this.columnContainer.width()-1 - totalColumnSize;
		
		for(var i in this.columns){
			if(this.columns[i].order > order){
				weight += this.columns[i].jq.width()/totalWidth;
				if(weight - random > 0){
					this.columns[i].jq.width(Math.floor(this.columns[i].jq.width() + widthDelta));
					break;
				}
			}
			this.columns[i].jq.height(this.columnContainer.height());
		}
	},
	onColumnLargeResize: function(order){
		var newHeight = this.columnContainer.height();
		var totalWidth = this.columnContainer.width()-1;
		var extraWidth = 0;
		
		var columnsCount = 0;
		var totalColumnSize = 0;
		for(var i in this.columns){
			if(this.columns[i].order <= order){
				totalWidth -= this.columns[i].jq.width();
				extraWidth += this.columns[i].jq.width();
			} else {
				columnsCount++;
			}
			totalColumnSize += this.columns[i].jq.width();
		}
		
		var widthDelta = this.columnContainer.width()-1 - totalColumnSize;
		
		var counter = 1;
		var remainder = totalWidth;
		
		for(var i in this.columns){
			var newWidth = 0;
			
			if(this.columns[i].order > order && columnsCount == counter) {
				
				if(columnsCount == 1){
					remainder = this.columns[i].jq.width() + widthDelta;	
				}
				newWidth = Math.floor(remainder);
			} else if(this.columns[i].order > order){
				newWidth = Math.floor(this.columns[i].jq.width() + 
						( (this.columns[i].jq.width()/(totalColumnSize - extraWidth)) * widthDelta));
				counter++;
				remainder -= newWidth;
			} 
			
			this.columns[i].columnResize(newWidth, newHeight);
		}
	},
	resizeOnColumnAdd: function(widthDelta){
		var totalWidth = this.columnContainer.width();
		var columnsCount = this.columns.__count__;
		
		var remainder = widthDelta;
		var counter = 1;
		for(var i in this.columns){
			var newWidth = 0;
			if(columnsCount == counter) {
				newWidth = Math.floor(this.columns[i].jq.width() - remainder);
			} else {
				newWidth = Math.floor(this.columns[i].jq.width() - 
							( (this.columns[i].jq.width()/totalWidth) * widthDelta));
				counter++;
			}
			
			remainder -= (this.columns[i].jq.width() - newWidth);
			
			this.columns[i].columnResize(newWidth);
		}
	},  //FIXME: merge the upper and lower functions together
	resizeOnColumnRemove: function(widthDelta){
		var remainder = widthDelta;
		widthDelta = (-1)*widthDelta;
		var totalWidth = this.columnContainer.width();
		var columnsCount = this.columns.__count__;
		
		var counter = 1;
		for(var i in this.columns){
			var newWidth = 0;
			
			if(columnsCount == counter) {
				newWidth = Math.floor(this.columns[i].jq.width() + remainder);
			} else {
				newWidth = Math.floor(this.columns[i].jq.width() - 
							( (this.columns[i].jq.width()/totalWidth) * widthDelta));
				counter++;
			}
			
			remainder += (this.columns[i].jq.width() - newWidth);
			
			this.columns[i].columnResize(newWidth);
		}
	},
	deleteColumn: function(column, removeMode){		
		var width = column.jq.width();
		
		this.moveItems(column, removeMode);
		
		column.jq.remove();
		delete this.columns[column.guid];
		this.resizeOnColumnRemove(width);
		
		this.onResizeStop();
		                    
		this.saveAllColumns();
	},
	moveItems: function(column, removeMode) {
		if(removeMode == column.REMOVE_MODES.MOVE_LEFT){
			this._move( column, column.order - 1 )
		} else if(removeMode == column.REMOVE_MODES.MOVE_RIGHT) {
			this._move(column, column.order + 1 )
		}
	},
	_move: function(column, nextOrder) {
		for(var i in this.columns){
			if(this.columns[i].order == nextOrder){
				for(var j in column.items){
					this.columns[i].addItem(column.items[j]);
					column.items[j].animatedRedraw();
					column.items[j].save();
				}
			}
		}
	},
	redraw: function() {
		for(var i in this.columns) {
			this.columns[i].redraw();
		}
	}, 
	getCurrentSprint:function() {
		return 0;
	}
});


