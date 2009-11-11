scrumwall.create("container", {
	removeItems:function(){
		for(var i in this.items) {
			$(this.items[i]).remove();
			delete this.items[i];
		}
	},
	loadItems:function(items){
		for(var i in items){
			var item = New("item", items[i]);
			this.addItem(item);
			item.redraw();
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

		if(this.columnType && (
				this.columnType == this.NOT_STARTED || this.columnType == this.DRAWER)) {
			$(item).css("z-index", "1000000");
		} else {
			$(item).css("z-index", "10");
		}
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
		
		//FIXME: move this to item
		if($(item).hasClass("sector")) {
			var ownerName = $('#ownerInput').val();
			if(ownerName == "Your name" || this.id == "col0") { //FIXME: need to do this in a better way
				ownerName = "";
			}
			item = New("item", {color: $(ui.helper).css("background-color"), 
								owner: ownerName, 
								sprintId:this.layout.getCurrentSprint(),
								column: this,
								coords: $(ui.helper).offset()});
			
			$(ui.helper).remove();
			item.expand();
		}
		this.addItem(item);
		item.save();
		this.stopEventPropagation();
	},
	onDragStop:function(event, ui){
		var item = ui.draggable[0];
		if(this.items[item.guid]){
			this.size--;
			delete this.items[item.guid];
			
		}
	},
	saveItems: function(){
		for(var i in this.items){
			this.items[i].save();
		}
	}	
} );
