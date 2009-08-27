createExtending("drawer", "container", {
	items:null,
	expanded:false,
	DRAWER:"DRAWER",
	initialize:function(config){
		$(this).css("background-color", config.color);
		this.guid = config.id;
		this.menu = config.menu;
		if(config.button){
			this.button = config.button;
			$(config.button).bind("click", {"scope":this, menu: this.menu}, this._onExpand, this);
		}
		this.columnType = this.DRAWER;
		this.items = new Array();
		$(this).droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop, greedy: true});
	},
	_onExpand:function(event){
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
				$(button).bind("click", {}, scope._onCollapse, scope);
			}
		);
		this.expanded = true;
	},
	_onCollapse:function(event){
		$(this.button).unbind("click");
		var scope = this;
		var button = this.button;
		this.removeItems();
		
		$(this).animate({ width:"0px", queue:false}, 250, function(){
			$(button).bind("click",{},scope._onExpand, scope);
		}
		);
		scope.expanded = false;
	},
	stopEventPropagation:function(){
		stopEventPropagation();
	}
	
})