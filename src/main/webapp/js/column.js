
scrumwall.create("column", {
	width:0,
	parentEl: null,
	items:null,
	init:function(colWidth, id, parentEl){
		this.id = id;
		
		this.col = jQuery.create("div",{"class":"column","id":id}); 
		$(this.col).width(colWidth);
		
		this.col.items = new Array();
		this.col.size = 0;
		
		this.header = jQuery.create("div",{"class":"colHeader"});
		$(this.header).text("Items:" + this.col.size);
		$(this.col).append($(this.header));
		
		this.body = jQuery.create("div",{"class":"colBody"});
		$(this.col).append($(this.body));
		
		this.parentEl = parentEl;
		$(this.parentEl).append($(this.col));
		
		this.col.header = this.header;
		this.col.body = this.body;
		
		$(this.col).droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop});
	},
	resize:function(newWidth){
		$(this.col).width(newWidth);
	},
	onItemDrop:function(event){
		var item = event.originalTarget;
		if(this.items[item.guid]){
			//item already present in the column
			return;
		}
		this.items[item.guid] = item;
		this.size++;
		$(this.header).text("Items:" + this.size);
	},
	onDragStop:function(event){
		var item = event.originalTarget;
		if(this.items[item.guid]){
			//item present in the column
			this.items[item.guid] = null;
			this.size--;
		}
		$(this.header).text("Items:" + this.size);
	}
});