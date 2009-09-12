	
createExtending("column", "container", {
	width:0,
	items:null,
	NOT_STARTED: "NOT_STARTED",
	DONE: "DONE",
	DEFAULT_WIDTH: 150,
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
		
		if(this.columnType != this.DONE && this.columnType != this.NOT_STARTED) {
			this.closeColumnButton = $.create("a", {"id": "closeColumnButton", "href": "#"});
			$(this.closeColumnButton).text("X").bind("click", {}, this.layout.closeColumn, this.layout);
			$(this.header).append(this.closeColumnButton);
		}
		this.jq.droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop});
		this.jq.resizable({minWidth:200, stop: this._onResizeStop, containment: 'parent', handles:"e"});
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
		var widthPercent = this.columnWidth / this.parent.width() * 100;
		var column = {width: widthPercent,
				name: this.name,
				order: this.order
			};
		if(this.guid) {
			column.id = this.guid;
		}
		return column;
	},
	save: function(){
		ColumnService.save(this._saveable(),
				{scope: this, callback: this._saveCallback, exceptionHandler:exceptionHandler});
		
		
	},
	_saveCallback:function(column){
		this.guid = column.id;
		this.id = "col."+column.id;
	},
	stopEventPropagation:function(){
		
	}
});