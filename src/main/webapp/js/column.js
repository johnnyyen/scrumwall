	
scrumwall.create("column", {
	width:0,
	parentEl: null,
	items:null,
	initialize:function(colWidth, id, parentEl){
		this.id = id;
		 
		$(this).width(colWidth);
		this.addItem = this.addItem;
		this.items = new Array();
		this.size = 0;
		
		this.header = jQuery.create("div",{"class":"colHeader"});
		$(this.header).text("Items:" + this.size);
		$(this).append($(this.header));
		
		this.body = jQuery.create("div",{"class":"colBody"});
		$(this).append($(this.body));
		
		this.parentEl = parentEl;
		$(this.parentEl).append($(this));
		
		this.header = this.header;
		this.body = this.body;
		
		$(this).droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop});
	},
	resize:function(newWidth){
		$(this).width(newWidth);
		for(var i in this.items){
			this.items[i].redraw();
		}
	},
	onItemDrop:function(event, ui){
		var item = ui.draggable[0];
		this.addItem(item, null);
		item.col = this;
		item.save();
	},
	onDragStop:function(event, ui){
		var item = ui.draggable[0];
		if(this.items[item.guid]){
			//item present in the column
			this.size--;
			delete this.items[item.guid];
			
		}
		$(this.header).text("Items:" + this.size);
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
		$(this.header).text("Items:" + this.size);
		item.setColumn(this);
	}
});