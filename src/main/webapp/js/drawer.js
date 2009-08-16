scrumwall.create("drawer", {
	items:null,
	initialize:function(config){
		if(config.button){
			$(config.button).bind("click", {"scope":this}, this.onUcbExpand);
		}
		this.items = new Array();
	},
	onUcbExpand:function(event){
		var scope = event.data.scope;
		$(this).unbind("click");

		var button = this;
		
		var notStarted = $("div[id=col.0]");
		var offset = $(notStarted).offset().left + $(notStarted).width();
		var ucbWidth = $(window).width() - offset;
		$("body").append(scope); 	
		$(scope).animate( { width:parseInt(ucbWidth)+"px", queue: false }, 250,  
			function(){
				ItemService.getItems(-1, 
						{"scope": scope, callback:scope.loadItems, exceptionHandler:exceptionHandler});
				$(button).bind("click", {"scope":scope}, scope.onUcbCollapse);
			}
		);
		
		
		
	},
	onUcbCollapse:function(event){
		$(this).unbind("click");
		var scope = event.data.scope;
		var button = this;
		scope.removeItems(scope);
		
		$(scope).animate({ width:"hide", queue:false}, 250, function(){
				$(button).bind("click",{"scope":scope},scope.onUcbExpand);
			}
		);
		
	},
	removeItems:function(scope){
		for(var i in scope.items) {
			$(scope.items[i]).remove();
			delete scope.items[i];
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