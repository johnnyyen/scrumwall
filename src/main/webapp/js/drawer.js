scrumwall.create("drawer", {
	items:null,
	expanded:false,
	initialize:function(config){
		$(this).css("background-color", config.color); //FIXME: remove this crap
		this.guid = config.id;
		this.menu = config.menu;
		if(config.button){
			this.button = config.button;
			$(config.button).bind("click", {"scope":this, menu: this.menu}, this.onExpand, this);
		}
		this.items = new Array();
		$(this).droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop, greedy: true});
	},
	onExpand:function(event){
		var scope = this;
		$(this.button).unbind("click");
		this.menu.collapseDrawers(this);

		var button = this.button;
		
		var notStarted = $("div[id=col.0]");
		var offset = $(notStarted).offset().left + $(notStarted).width();
		var width = $(window).width() - offset;
		$("body").append(this); 	
		$(this).animate( { "width":parseInt(width)+"px", queue: false }, 250,  
			function(){
				ItemService.getItems(scope.guid, 
						{"scope": scope, callback:scope.loadItems, exceptionHandler:exceptionHandler});
				$(button).bind("click", {}, scope.onCollapse, scope);
			}
		);
		this.expanded = true;
	},
	onCollapse:function(event){
		$(this.button).unbind("click");
		var scope = this;
		var button = this.button;
		this.removeItems();
		
		$(this).animate({ width:"0px", queue:false}, 250, function(){
				$(button).bind("click",{},scope.onExpand, scope);
			}
		);
		scope.expanded = false;
	},
	removeItems:function(){
		for(var i in this.items) {
			$(this.items[i]).remove();
			delete this.items[i];
		}
	},
	loadItems:function(items){
		for(var i in items){
			var item = newItem(items[i]);
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

		$(item).css("z-index", "1000000");
	},
	resize:function(newWidth){
		$(this).width(newWidth);
		for(var i in this.items){
			this.items[i].redraw();
		}
	},
	onItemDrop:function(event, ui){
		var item = ui.draggable[0];
		
		if($(item).hasClass("sector")){
			var coords = $(ui.helper).offset();
			var ownerName = $('#ownerInput').val();
			if(ownerName == "Your name" || this.id == "col0") { //FIXME: need to do this in a better way
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
		this.menu.eventPropagationStopped = true;
	},
	onDragStop:function(event, ui){
		var item = ui.draggable[0];
		if(this.items[item.guid]){
			//item present in the column
			this.size--;
			delete this.items[item.guid];
			
		}
	},
	
} );