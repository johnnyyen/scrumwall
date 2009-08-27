	
createExtending("column", "container", {
	width:0,
	parentEl: null,
	items:null,
	NOT_STARTED: "NOT_STARTED",
	DONE: "DONE",
	initialize:function(config){
		this.menu = config.menu;
		this.layout = config.layout;
		this.parent = $("#columnContainer");
		this.guid = config.id;
		
		if(config.width){
			//FIXME: where did the "-3" come from???
			this.columnWidth = parseInt(config.width * this.parent.width() / 100)-3;
		}else{
			this.columnWidth = config.colWidth;
		}
		
		this.items = new Array();
		this.size = 0;
		this.columnType = config.columnType;
		this.order = config.order ? config.order : 0;		
		this.name = config.name;
		this.parentEl = config.parentEl;
		
		this._initDom();
	},
	_initDom:function(){
		this.header = jQuery.create("div",{"class":"colHeader"});
		this.body = jQuery.create("div",{"class":"colBody"});

		$(this).width(this.columnWidth);
		$(this).attr("id", "col." + this.guid);
		$(this.header).text(this.name);
		$(this).append($(this.header));
		$(this).append($(this.body));
		$(this.parentEl).append($(this));

		$(this).droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop});
		$(this).resizable({minWidth:200, stop: this._onResizeStop, containment: 'parent', handles:"e"});
	},	
	_onResizeStop:function(){
		var delta = $(this).width() - this.columnWidth;
		this.columnResize($(this).width());
		this.layout.onColumnResize(this.order, delta);
		this.columnWidth = $(this).width();
	},
	resize:function(){
		this._onResizeStop()
	},
	columnResize:function(newWidth){
		this.columnWidth = $(this).width();
		$(this).width(newWidth);
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