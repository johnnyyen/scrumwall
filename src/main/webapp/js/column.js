	
createExtending("column", "container", {
	width:0,
	parentEl: null,
	items:null,
	NOT_STARTED: "NOT_STARTED",
	DONE: "DONE",
	initialize:function(config){
		map(config,this);
		this.jq = $(this);
		this.guid = config.id;		
		this.parent = $("#columnContainer");
		this.items = new Array();

		if(config.width){
			//FIXME: where did the "-3" come from???
			this.columnWidth = parseInt(config.width * this.parent.width() / 100)-3;
		}else{
			this.columnWidth = config.colWidth;
		}
		
		this._initDOM();
	},
	_initDOM:function(){
		this.header = jQuery.create("div",{"class":"colHeader"});
		this.body = jQuery.create("div",{"class":"colBody"});

		this.jq.width(this.columnWidth);
		this.jq.attr("id", "col." + this.guid);
		$(this.header).text(this.name);
		$(this.parentEl).append(this.jq);
		this.jq.append($(this.header)).append($(this.body));

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
	columnResize:function(newWidth){
		this.columnWidth = this.jq.width();
		this.jq.width(newWidth);
		for(var i in this.items){
			this.items[i].redraw();
		}
	},
	_saveable:function(){
		var widthPercent = this.columnWidth / this.parent.width() * 100;
		var column = {id: this.guid,
				width: widthPercent,
				name: this.name,
				order: this.order
			};
		return column;
	},
	save: function(){
		ColumnService.save(this._saveable(),
				{scope: this, callback: this._saveCallback, exceptionHandler:exceptionHandler});
		
		
	},
	_saveCallback:function(column){
		this.guid = column.id;
	},
	stopEventPropagation:function(){
		
	}
});