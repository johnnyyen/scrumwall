	
scrumwall.create("column", {
	width:0,
	parentEl: null,
	items:null,
	NOT_STARTED: "NOT_STARTED",
	initialize:function(config){
		this.menu = config.menu;
		this.guid = config.id; 
		$(this).width(config.colWidth);
		this.addItem = this.addItem;
		this.items = new Array();
		this.size = 0;
		this.columnType = config.columnType;
		
		this.header = jQuery.create("div",{"class":"colHeader"});
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
	},
	resize:function(newWidth){
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
	saveItems: function(col){
		for(var i in col.items){
			col.items[i].save();
		}
	}
});