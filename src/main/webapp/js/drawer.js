createExtending("drawer", "container", {
	items:null,
	expanded:false,
	
	initialize:function(config){
		map(config, this);
		this.guid = this.id;
		this.columnType = this.DRAWER;
		this.items = new Array();
		this.jq = $(this);
        this.body = this;
		
		this.initializeParent();
		
		if(this.button){
			$(this.button).bind("click", $.proxy(this._onExpand, this));
		}

		this.jq.css("background-color", this.color);
		this.jq.droppable({over: this.itemOverContainer, drop:this.onItemDrop, tolerance:"intersect",
            out:this.onDragStop, acceptFallthrough: true});
		this.jq.bind("closeDrawers",  $.proxy(this._onCollapse, this));

		this.zIndex = 10000;
		
		this.jq.css("z-index",this.zIndex);
	},
	_onExpand:function(event){
		var scope = this;
		$(this.button).unbind("click");
		this.layout.collapseDrawers(this);

		var button = this.button;
		
		
		var offset = this._getWidthOffset();
		var width = $(window).width() - offset;
		$("body").append(this); 	
		this.jq.animate( { "width":parseInt(width)+"px", queue: false }, 250,  
			function(){
				ItemService.getItems(scope.guid, 
						{"scope": scope, callback:scope.loadItems, exceptionHandler:exceptionHandler});
				$(button).bind("click",  $.proxy(scope._onCollapse, scope));
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
				$(button).bind("click", $.proxy(scope._onExpand, scope));
			}
		);
		this.expanded = false;
	},
	loadItems:function(itemConfigs){
		
		for(var i in itemConfigs){
			var item = New("item", itemConfigs[i], this);
			this.addItem(item);
		}
	},
	drawerExpanded: function(){
		return this.expanded;
	},
	_getWidthOffset: function(){
		var notStarted = this.layout.getNotStartedColumn();
		
		if(this.drawerType == this.layout.DRAWERTYPES.UCB){
			return notStarted.jq.offset().left + notStarted.jq.width();
		}else {
			return notStarted.jq.offset().left;
		}
	},
	redraw: function() {
		if(this.expanded){
			var offset = this._getWidthOffset();
			this.jq.width($(window).width() - offset);
			
			for(var i in this.items){
				this.items[i].redraw();
			}
		}
	}
});