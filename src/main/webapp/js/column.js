	
createExtending("column", "container", {
	width:0,
	items:null,
	NOT_STARTED: "NOT_STARTED",
	DONE: "DONE",
	IN_PROGRESS: "IN_PROGRESS",
	REGULAR: "REGULAR",
	DEFAULT_WIDTH: 150,
	REMOVE_MODES:{
		MOVE_LEFT: 1,
		MOVE_RIGHT: 2,
		REMOVE: 3,
		NO_ITEMS: 4
	},
	initialize:function(config){
		map(config,this);
		this.jq = $(this);
		this.guid = config.id;
		this.items = new Array();

		if(!this.name){
			this.name = "Double click me";
		}
		if(config.width){
			//FIXME: where did the "-3" come from???
			this.columnWidth = parseInt(config.width * this.parent.width() / 100)-3;
		}else if(config.colWidth){
			this.columnWidth = config.colWidth;
		}else{
			this.columnWidth = this.DEFAULT_WIDTH;
		}
		
		if(!this.columnType) {
			this.columnType = this.REGULAR;
		}
		
		if(!this.sprintId || this.sprintId >= 0) {
			this.sprintId = this.layout.getCurrentSprint();
		}
		
		this._initDOM();
	},
	_initDOM:function(){
		this.header = $.create("div",{"class":"colHeader"});
		this.body = $.create("div",{"class":"colBody"});

		if(this.columnType == this.DONE) {
			this.jq.addClass("doneColumn")
		}
		
		this.jq.width(this.columnWidth);
		if(this.guid != undefined){
			this.jq.attr("id", "col." + this.guid);
		}
		
		$(this.header).text(this.name);
		$(this.parent).append(this.jq);
		this.jq.append($(this.header)).append($(this.body));

		if(this.columnType == this.DONE) {
			this.newColumnButton = $.create("a", {"id": "newColumnButton", "href": "#"});
			$(this.newColumnButton).text("+").bind("click",{},this.layout.createColumn, this.layout);
			$(this.header).append(this.newColumnButton);
		}
		
		if(this.columnType == this.REGULAR) {
			this.deleteColumnButton = $.create("a", {"id": "deleteColumnButton", "href": "#"});
			$(this.deleteColumnButton).text("X").bind("click", {}, this.deleteColumn, this);
			$(this.header).append(this.deleteColumnButton);
		}
		
		if(this.columnType != this.DONE && this.columnType != this.NOT_STARTED) {
			this.jq.addClass("sortableColumn");
		}
		
		this.jq.droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop});
		this.jq.resizable({stop: this._onResizeStop, containment: 'parent', handles:"e"});
	},	
	_onResizeStop:function(){
		var delta = this.jq.width() - this.columnWidth;
		this.columnResize(this.jq.width());
		this.layout.onColumnResize(this.order, delta);
		this.columnWidth = this.jq.width();
	},
	resize:function(){
		this._onResizeStop()
	},
	columnResize:function(newWidth, newHeight){
		this.columnWidth = this.jq.width();
		
		if(newWidth){
			this.jq.width(newWidth);
		}
		if(newHeight){
			this.jq.height(newHeight);
		}
		if(newWidth || newHeight){
			for(var i in this.items){
				this.items[i].redraw();
			}
		}
	},
	_saveable:function(){
		var widthPercent = this.jq.width() / this.parent.width() * 100;
		var column = {width: widthPercent,
				name: this.name,
				order: this.order,
				columnType: this.columnType,
				sprintId: this.sprintId
			};
		if(this.guid !== undefined) {
			column.id = this.guid;
		}
		return column;
	},
	save: function(){
		ColumnService.save(this._saveable(), 
				{async: false, scope: this, callback: this._saveCallback, exceptionHandler:exceptionHandler});
		
		
	},
	_saveCallback:function(column){
		this.guid = column.id;
		this.id = "col."+column.id;
	},
	stopEventPropagation:function(){
		
	},
	deleteColumn:function(){
		if(this.items.length > 0){
			this._showRemoveModeDialog();
		}else{
			this._deleteColumn(this.REMOVE_MODES.NO_ITEMS);
		}
	},
	_deleteColumn:function(removeMode) {
		ColumnService.remove(this._saveable(), removeMode, {scope: this, exceptionHandler:exceptionHandler});
		this.layout.deleteColumn(this, removeMode)
	},
	_showRemoveModeDialog:function(){
		var dialog = $.create("div", {"id": "removeMode"});
		var title = "What to do with items in the column?";
		var layout = this.layout;
		var column = this;
		//FIXME: remove mode identifiers are hardcoded
		var buttons = {"Move left": function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.MOVE_LEFT);}, 
				"Delete": function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.REMOVE);},
				"Move right": function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.MOVE_RIGHT);}};
		$(dialog).dialog({"title":title,"buttons": buttons, resizable:false, modal:true, height:150,width:380});
		
	}
});