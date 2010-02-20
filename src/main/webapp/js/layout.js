create("layout", {
	itemCount:0,
	itemZIndex:10,
	DEFAULT_COLUMN_WIDTH: 150,
	ALL_COLUMNS: -1,
	MAGIC_PIXEL: 1, //This is literally a magic pixel. Seems that the browser or jQuery keeps lying about sizes and in 
					//some cases you cannot fit 300px worth of divs inside a 300px wide div.
	DRAWERTYPES: {
		UCB: "UCB",
		GOALS: "GOALS",
		IMPEDIMENTS: "IMPEDIMENTS"
	},
	
	init: function(){
		var t = $("#tabbar");
		t.tabs();
		this.menu = new scrumwall.menu(this);
		this._initDrawers();
		
		this.columnContainer = $("#columnContainer");
		$("#trashcan").droppable({drop:this.onItemDelete, tolerance:"touch", acceptFallthrough: false});
		
		ColumnService.getColumns(this.getCurrentSprint(), {async:false, scope: this, callback: this.createColumns, exceptionHandler:exceptionHandler});
		var scope = this;
		
		$(window).bind("resize", $.proxy(this.onWindowResize, this));
		window.onbeforeunload = function(){return scope.onPageUnload(scope);};
		$(this).bind("columnResize", $.proxy(this.onColumnResize, this));
		
		this.columnContainer.sortable({
			items: '.sortableColumn',
			handle : '.colHeader',
			containment: 'parent',
		    scroll: false,
		    revert: true,
		    tolerance: "intersect",
		    update: function(event, ui){ scope._updateColumnOrders(); scope.saveAllColumns(); }
		  });
		
		this.previousContainerWidth = this.columnContainer.width();
	}, 
	createColumns:function(columnConfigs){
		this.columns = new Array();
		for(var i=0; i < columnConfigs.length; i++){
			columnConfigs[i].parent = this.columnContainer;
			columnConfigs[i].menu = this.menu;
			columnConfigs[i].layout = this;
			
			var column = New("column", columnConfigs[i]);
			this.columns[columnConfigs[i].id] = column;
		}
		this.setColumnWidths();
	},  
	createColumn: function(){
		
		var config = {layout: this, 
					  parent: this.columnContainer,
					  width: this.DEFAULT_COLUMN_WIDTH / this.columnContainer.width() * 100};
		var column = New("column",config);
		$('.doneColumn').before($(column));
		column.jq.width(this.DEFAULT_COLUMN_WIDTH);

		//this is added into the columns before save because otherwise onResizeStop cannot calculate the correct widths
		this.columns["new"]=column;
		this._updateColumnOrders();
		this.onColumnResize(this.ALL_COLUMNS, this.DEFAULT_COLUMN_WIDTH);
		this.redraw();
		this.calculatePercentages();
		this.saveAllColumns();
		delete this.columns["new"];
		$(column.header).dblclick();

		this.columns[column.guid] = column;
	},
	deleteColumn: function(column, removeMode){		
		var width = column.jq.width();
		
		this.moveItems(column, removeMode);
		
		column.jq.remove();
		delete this.columns[column.guid];
		this.onColumnResize(this.ALL_COLUMNS, width);
		
		this.calculatePercentages();
		          
		this.saveAllColumns();
	},
	calculatePercentages: function(){
		var remainder = 0;
		var percentage = 0;
		var totalPercentage = 100;
		var counter = 1;
		for(var i in this.columns ){
			if(counter == count(this.columns)) {
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
	},
	/*
	 * This method calculates the size of the columns in pixels, based on percentage values received from the database.
	 * We take the size of the columnContainer, multiply it by the percentage and set these pixels as the width.
	 */
	setColumnWidths: function(){
		var remainder = 0;
		var pixels = 0;
		var totalPixels = this.columnContainer.width();
		var counter = 1;
		for(var i in this.columns ){
			if(counter == count(this.columns)) {
				this.columns[i].columnWidth = Math.floor(totalPixels) - this.MAGIC_PIXEL;
				pixels = Math.floor(totalPixels) - this.MAGIC_PIXEL;
			}else{
				var size = this.columns[i].width*this.columnContainer.width()/100 + remainder;
				pixels = Math.floor(size);
				totalPixels -= pixels;
				remainder = size - pixels;
				this.columns[i].columnWidth = pixels;
			}
			this.columns[i].jq.width( pixels );
			counter++;
		}
	},
	saveAllColumns: function() {
		for(var i in this.columns){
			this.columns[i].save();
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
	onWindowResize:function(){		
		var width = this.columnContainer.width();
		var widthDelta = this.previousContainerWidth - width;
		this.previousContainerWidth = width;
		this.onColumnResize(this.ALL_COLUMNS,widthDelta);
		this.redraw();
	},
	//also see item.remove()
	onItemDelete:function(event, ui){
        if(ui.draggable[0].remove) {
		    ui.draggable[0].remove();
        }
	},
	onPageUnload: function(scope){
		//FIXME: always saves all items when unloading page
//		scope.saveAllColumns();
//		scope.saveAllDrawers();
		
		//FIXME: put a normal message here
//		return "Don't leave please";
	},
	onColumnResize: function(order, widthDelta){
		widthDelta *= (-1);
		if(Math.abs(widthDelta) > 10){
			this._onColumnLargeResize(order);
		}else{
			this._onColumnSmallResize(order);
		}
	},
	_onColumnSmallResize: function(order){
		var newHeight = this.columnContainer.height();
		var weight = 0;
		var random = Math.random();
		
		var totalColumnSize = 0;
		var totalWidth = this.columnContainer.width();
		for(var i in this.columns){
			if(this.columns[i].order <= order){
				totalWidth -= this.columns[i].jq.width();
			}
			totalColumnSize += this.columns[i].jq.width();
			
			this.columns[i].jq.height(newHeight);
		}
		
		var widthDelta = this.columnContainer.width() - this.MAGIC_PIXEL - totalColumnSize;
		
		for(var i in this.columns){
			if(this.columns[i].order > order){
				weight += this.columns[i].jq.width()/totalWidth;
				if(weight - random > 0){
					this.columns[i].jq.width(Math.floor(this.columns[i].jq.width() + widthDelta));
					break;
				}
			}
		}
	},
	_onColumnLargeResize: function(order){
		var newHeight = this.columnContainer.height();
		var totalWidth = this.columnContainer.width() - this.MAGIC_PIXEL;
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
		
		var widthDelta = this.columnContainer.width() - this.MAGIC_PIXEL - totalColumnSize;
		
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
	moveItems: function(column, removeMode) {
		if(removeMode == column.REMOVE_MODES.MOVE_LEFT){
			this._move( column, column.order - 1 );
		} else if(removeMode == column.REMOVE_MODES.MOVE_RIGHT) {
			this._move(column, column.order + 1 );
		}
	},
	_move: function(column, nextOrder) {
		for(var i in this.columns){
			if(this.columns[i].order == nextOrder){
				for(var j in column.items){
                    var item = column.items[j];
					this.columns[i].addItem(item);
                    //FIXME redraw should not be called here
                    item.redraw();
                    $(item).appendTo(this.columns[i].body);
                    item.save(); 
				}
                break;
			}
		}
	},
	redraw: function() {
		for(var i in this.columns) {
			this.columns[i].redraw();
		}
		for(var i in this.drawers) {
			this.drawers[i].redraw();
		}
		
	},
	getCurrentSprint:function() {
		return 0; //FIXME: should be real when sprints are implemented
	},
	getNotStartedColumn: function(){
		for(var i in this.columns){
			if(this.columns[i].columnType == this.columns[i].NOT_STARTED){
				return this.columns[i];
			}
		}
		
		return null;
	},
	_initDrawers: function() {
		this.drawers = new Array();
		
		
		this.drawers[-1] = (New("drawer", {layout: this, drawerType: this.DRAWERTYPES.UCB,
				button: this.menu.ucb, id: -1, color: "green"}));
		
		
		this.drawers[-2] = (New("drawer", {layout: this, drawerType: this.DRAWERTYPES.GOALS,
				button: this.menu.goals, id: -2, color: "pink"}));
		
		this.drawers[-3] = (New("drawer", {layout: this, drawerType: this.DRAWERTYPES.IMPEDIMENTS,
				button: this.menu.impediments, id: -3, color: "yellow"}) );
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


