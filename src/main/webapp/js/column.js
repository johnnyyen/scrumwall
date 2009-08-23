	
scrumwall.create("column", {
	width:0,
	parentEl: null,
	items:null,
	NOT_STARTED: "NOT_STARTED",
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
		$(this).width(this.columnWidth);
		
		this.addItem = this.addItem;
		this.items = new Array();
		this.size = 0;
		this.columnType = config.columnType;
		this.order = config.order ? config.order : 0;
		
		this.header = jQuery.create("div",{"class":"colHeader"});
		this.name = config.name;
		$(this.header).text(config.name);
		$(this).append($(this.header));
		
		this.body = jQuery.create("div",{"class":"colBody"});
		$(this).append($(this.body));
		
		this.parentEl = config.parentEl;
		$(this.parentEl).append($(this));
		
		this.header = this.header;
		this.body = this.body;
		$(this).attr("id", "col." + config.id);
		
		$(this).droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop});
		$(this).resizable({minWidth:200, stop: this.onResizeStop, containment: 'parent', handles:"e"});

	},
	
	onResizeStop:function(){
		var delta = $(this).width() - this.columnWidth;
		this.columnResize($(this).width());
		this.layout.onColumnResize(this.order, delta);
		this.columnWidth = $(this).width();
	},
	resize:function(){
		this.onResizeStop()
	},
	columnResize:function(newWidth){
		this.columnWidth = $(this).width();
		$(this).width(newWidth);
		for(var i in this.items){
			this.items[i].redraw();
		}
	},
	onItemDrop:function(event, ui){
		if(this.menu.eventPropagationStopped == true){
			this.menu.eventPropagationStopped = false;
			return;
		}
		
		var item = ui.draggable[0];
		
		if($(item).hasClass("sector")){
			var coords = $(ui.helper).offset();
			var ownerName = $('#ownerInput').val();
			if(ownerName == "Your name" || this.id == "col.0") { //FIXME: need to do this in a better way
				ownerName = "";
			}
			item = newItem({color: $(ui.helper).css("background-color"), owner: ownerName});
			item.column = this;
			item.setRelativeCoords(coords);
			item.redraw();
			$(ui.helper).remove();
		}
		this.addItem(item);
		item.save();
	},
	onDragStop:function(event, ui){
		var item = ui.draggable[0];
		if(this.items[item.guid]){
			//item present in the column
			this.size--;
			delete this.items[item.guid];
			
		}
	},
	addItem:function(item){		
		if(this.items[item.guid]){
			//item already present in the column
			return;
		}
		if(this.items){
			this.items[item.guid] = item;
		}else{
			this.items = new Array();
			this.items[item.guid] = item;
		}
		this.size++;
		item.setColumn(this);
		if(this.columnType == this.NOT_STARTED) {
			$(item).css("z-index", "1000000");
		} else {
			$(item).css("z-index", "10");
		}
	},
	saveItems: function(){
		for(var i in this.items){
			this.items[i].save();
		}
	},
	saveable:function(){
		var widthPercent = this.columnWidth / this.parent.width() * 100;
		var column = {id: this.guid,
				width: widthPercent,
				name: this.name,
				order: this.order
			};
		return column;
	},
	save: function(){
		ColumnService.save(this.saveable(),
				{scope: this, callback: this.saveCallback, exceptionHandler:exceptionHandler});
		
		
	},
	saveCallback:function(column){
		this.guid = column.id;
	}
});