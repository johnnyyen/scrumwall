scrumwall.create("container", {
	NOT_STARTED: "NOT_STARTED",
	DONE: "DONE",
	IN_PROGRESS: "IN_PROGRESS",
	REGULAR: "REGULAR",
	DRAWER:"DRAWER",
	
	items: new Array(),
	zIndex:0,
	
	initializeParent: function(){
		this.jq.bind("dblclick", $.proxy(this.createItem, this));

	},
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
	createItem: function(event){

		var ownerName = this._getOwnerName();
		
		var item = New("item", {owner: ownerName, 
                sprintId:this.layout.getCurrentSprint(),
                column: this,
                coords: {left: event.pageX, top: event.pageY}
            },
            this);
		
		item.expand();
		
		this.addItem(item);
		
		item.save();
	},
	onItemDrop:function(event, ui){
		var item = ui.draggable[0];

		if(!$(item).hasClass("item") && !$(item).hasClass("sector")){
			return;
		}

		var ownerName = this._getOwnerName();

        var itemCreated = false;
		if($(item).hasClass("sector")) {
			item = New("item", {color: $(ui.helper).css("background-color"),
								owner: ownerName,
								sprintId:this.layout.getCurrentSprint(),
								column: this,
								coords: $(ui.helper).offset()
                                }, this);

			$(ui.helper).remove();

            itemCreated = true;
		}

        item.setOwner(ownerName);

		this.addItem(item);

        item.setRelativeCoords();
        item.redraw();

		item.save();

        if(itemCreated) item.expand();

        return true;
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
//        if(item.setRelativeCoords) {
//
//            var offset = item.jq.width();
//
//            offset -= item.column.jq.width();
//
//            console.log("col: " + this.jq.attr('id') + " left: " + offset);
//
//            console.log($(this.body))
//            $(item).appendTo(this.body ? $(this.body): $(this));
//            $(this.body ? $(this.body): $(this)).append(item);
//
//
//            item.setColumn(this);
//
//            item.setRelativeCoords(offset);
//            item.jq.css("left", 0 +"px")
//            $(item).css("left",0);
//            item.redraw();
//        }
    },
	_getOwnerName: function(){
		var ownerInput = this.layout.menu.owner;
		var ownerName = ownerInput.val();
		if(!ownerInput.hasClass("changed") 
				|| this.columnType == this.NOT_STARTED 
				|| this.columnType == this.DRAWER) {
			ownerName = "";
		}
		
		return ownerName;
	}
} );
