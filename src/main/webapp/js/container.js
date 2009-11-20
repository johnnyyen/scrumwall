scrumwall.create("container", {
	NOT_STARTED: "NOT_STARTED",
	DONE: "DONE",
	IN_PROGRESS: "IN_PROGRESS",
	REGULAR: "REGULAR",
	DRAWER:"DRAWER",
	
	items: new Array(),
	zIndex:0,
	removeItems:function(){
		for(var i in this.items) {
			$(this.items[i]).remove();
			delete this.items[i];
		}
	},
	addItem:function(item){		
		if(this.items[item.guid]){
			//item already present in the column
			return;
		}
		
		this.items[item.guid] = item;
		item.setColumn(this);

		$(item).css("z-index", ++this.zIndex);
		
	},
	resize:function(newWidth){
		$(this).width(newWidth);
		this.redraw();
	},
	redraw: function() {
		for(var i in this.items){
			this.items[i].redraw();
		}
	},
	onItemDrop:function(event, ui){
		if(isEventPropagationStopped()) return;
		var item = ui.draggable[0];
		
		if(!$(item).hasClass("item") && !$(item).hasClass("sector")){
			return;
		}
		
		var ownerInput = this.layout.menu.owner;
		var ownerName = ownerInput.val();
		if(!ownerInput.hasClass("changed") 
				|| this.columnType == this.NOT_STARTED 
				|| this.columnType == this.DRAWER) {
			ownerName = "";
		}
		
		if($(item).hasClass("sector")) {
			item = New("item", {color: $(ui.helper).css("background-color"), 
								owner: ownerName, 
								sprintId:this.layout.getCurrentSprint(),
								column: this,
								coords: $(ui.helper).offset()});
			
			$(ui.helper).remove();
			item.expand();
		}
		
		this.addItem(item);
		
		if(!$(item).hasClass("sector")) {
			item.setOwner(ownerName);
		}
		
		item.save();
		this.stopEventPropagation();
	},
	onDragStop:function(event, ui){
		var item = ui.draggable[0];
		if(this.items[item.guid]){
			delete this.items[item.guid];
			
		}
	},
	saveItems: function(){
		for(var i in this.items){
			this.items[i].save();
		}
	},
	itemOverContainer: function(event, ui){
		if(this.layout.isDrawerExpanded() && this.columnType != this.DRAWER) return;
		
		var item = ui.draggable[0];
		$(item).css("z-index",this.zIndex+1);
	}
} );
