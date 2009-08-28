createExtending("drawer", "container", {
	items:null,
	expanded:false,
	DRAWER:"DRAWER",
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
		this.jq.droppable({drop:this.onItemDrop, tolerance:"intersect",out:this.onDragStop, greedy: true});
		this.jq.bind("closeDrawers", {}, this._onCollapse, this);
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
		scope.expanded = false;
	},
	stopEventPropagation:function(){
		stopEventPropagation();
	}
	
})