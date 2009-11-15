createExtending("drawer", "container", {
	items:null,
	expanded:false,
	
	initialize:function(config){
		map(config, this);
		this.guid = this.id;
		this.columnType = this.DRAWER;
		this.items = new Array();
		this.jq = $(this);
		
		if(this.button){
			$(this.button).bind("click", {menu: this.menu}, this._onExpand, this);
		}
		
		this.jq.css("background-color", this.color);
		this.jq.droppable({over: this.itemOverContainer, drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop, greedy: true});
		this.jq.bind("closeDrawers", {}, this._onCollapse, this);
		
		this.zIndex = 10000;
		this.jq.css("z-index",this.zIndex);
	},
	_onExpand:function(event){
		var scope = this;
		$(this.button).unbind("click");
		this.menu.collapseDrawers(this);		

		var button = this.button;
		
		var notStarted = this.menu.layout.getNotStartedColumn();
		var offset = 0;
		if(this.drawerType == this.menu.DRAWERTYPES.UCB){
			offset = notStarted.jq.offset().left + notStarted.jq.width();
		}else {
			offset = notStarted.jq.offset().left;
		}
		var width = $(window).width() - offset;
		$("body").append(this); 	
		this.jq.animate( { "width":parseInt(width)+"px", queue: false }, 250,  
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
		this.expanded = false;
	},
	stopEventPropagation:function(){
		stopEventPropagation();
	},
	loadItems:function(itemConfigs){
		
		for(var i in itemConfigs){
			var item = New("item", itemConfigs[i], this.menu.drawers);
			this.addItem(item);
		}
	},
	drawerExpanded: function(){
		return this.expanded;
	}
});