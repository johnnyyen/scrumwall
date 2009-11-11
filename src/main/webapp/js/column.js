	
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
		//FIXME: rename columnWidth to reflect that it contains width in pixels
		/*
		if(config.width){
			//FIXME: where did the "-3" come from???
			this.columnWidth = parseInt(config.width * this.parent.width() / 100)//-3;
		}else if(config.colWidth){
			this.columnWidth = config.colWidth;
		}else{
			this.columnWidth = this.DEFAULT_WIDTH;
		}
		*/
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
		this.headerInput = $.create("input", {"type": "text", "class": "columnNameInput"});
		this.headerText = $.create("div", {"class": "columnNameText"});
		$(this.headerInput).hide();
		
		if(this.columnType == this.DONE) {
			this.jq.addClass("doneColumn")
		}
		
		//this.jq.width(this.columnWidth);
		if(this.guid != undefined){
			this.jq.attr("id", "col." + this.guid);
		}
		this.jq.append($(this.header)).append($(this.body));

		if(this.columnType == this.DONE) {
			this.newColumnButton = $.create("a", {"id": "newColumnButton", "href": "#"});
			$(this.newColumnButton).text("+").bind("click",{},this.layout.createColumn, this.layout);
			$(this.header).append(this.newColumnButton);
		}
		
		if(this.columnType == this.REGULAR) {
			this.deleteColumnButton = $.create("a", {"class": "deleteColumnButton", "href": "#"});
			$(this.deleteColumnButton).text("X").bind("click", {}, this.deleteColumn, this);
			$(this.header).append(this.deleteColumnButton);
		}
		
		$(this.headerText).text(this.name);
		$(this.header).append($(this.headerInput));
		$(this.header).append($(this.headerText));
		$(this.parent).append(this.jq);
		
		if(this.columnType != this.DONE && this.columnType != this.NOT_STARTED) {
			this.jq.addClass("sortableColumn");
		}
		
		$(this.headerText).bind("dblclick", {}, this._editName, this);
		$(this.headerInput).bind("blur", {}, this._nameEdited, this);
		$(this.headerInput).bind("keypress", {}, this._nameEdited, this);
		this.jq.droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop});
		var instance = this;
		this.jq.resizable({stop: function(){instance.layout.onResizeStop()}, containment: 'parent', handles:"e"});
	},
	_editName: function() {
		
		$(this.headerText).hide();
		$(this.headerInput).show();		
		$(this.headerInput).val($(this.headerText).text());
		$(this.headerInput).select();
	},
	_nameEdited: function(event) {
		if(event.type == "keypress" && 
				!($.ui.keyCode.ESCAPE == event.keyCode 
						|| $.ui.keyCode.ENTER == event.keyCode 
						|| $.ui.keyCode.NUMPAD_ENTER == event.keyCode)) {
			return;
		}
		if ($.ui.keyCode.ESCAPE == event.keyCode){
			//escape cancels editing
		}else if($.trim($(this.headerInput).val()) == "") {
			//FIXME: show tooltip with error message
		}else{
			$(this.headerText).text($(this.headerInput).val());
			this.name = $(this.headerText).text(); 
			this.save();
		}
		$(this.headerInput).hide();
		$(this.headerText).show();
	},
	resize:function(){
		var delta = this.jq.width() - this.columnWidth;
		this.columnResize(this.jq.width());
		this.layout.onColumnResize(this.order, delta);
		this.columnWidth = this.jq.width();
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
		var column = {width: this.width,
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
		if(this.items.__count__ > 0){
			this._showRemoveModeDialog();
		}else{
			this._deleteColumn(this.REMOVE_MODES.NO_ITEMS);
		}
	},
	_deleteColumn:function(removeMode) {
		ColumnService.remove(this._saveable(), removeMode, {scope: this, exceptionHandler:exceptionHandler});
		if(removeMode == this.REMOVE_MODES.REMOVE){
			for(var i in this.items){
				this.items[i].remove();
			}
		}
		
		this.layout.deleteColumn(this, removeMode)
	},
	_showRemoveModeDialog:function(){
		var dialog = $.create("div", {"id": "removeMode"});
		var title = "What to do with items in the column?";
		var layout = this.layout;
		var column = this;
		//FIXME: remove mode identifiers are hardcoded
		var buttons = {"Move right": function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.MOVE_RIGHT);}, 
				"Delete": function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.REMOVE);},
				"Move left": function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.MOVE_LEFT);}
				};
		$(dialog).dialog({"title":title,"buttons": buttons, resizable:false, modal:true, height:150,width:380});
		
	}
});