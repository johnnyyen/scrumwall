createExtending("drawer", "container", {
	items:null,
	expanded:false,
	
	initialize:function(config){
		map(config, this);
		this.columnType = this.DRAWER;
		this.items = new Array();
		this.jq = $(this);
        this.body = this;
		
		this.initializeParent();
		
		if(this.button){
			$(this.button).bind("click", $.proxy(this._expand, this));
		}

		this.jq.css("background-color", this.color);
		this.jq.droppable({drop:this.onItemDrop, tolerance:"intersect",
            out:this.onDragStop});
        this.jq.droppable({over: this.itemOverContainer, tolerance:"touch"});
		this.jq.bind("collapse",  $.proxy(this._collapse, this));

		this.zIndex = 10000;
		
		this.jq.css("z-index",this.zIndex);
	},
	_expand:function(){
		var scope = this;
		$(this.button).unbind("click");
		$(".drawer[id!=" + this.id + "]").trigger("collapse");

		var button = this.button;
		
		this.jq.height($(window).height() - this._getHeightOffset() + "px");
		
		var offset = this._getWidthOffset();
		var width = $(window).width() - offset;
		$("body").append(this); 	
		this.jq.animate( { "width":parseInt(width)+"px", queue: false }, 250,  
			function(){
				ItemService.getItems(scope.id, 
						{"scope": scope, callback:scope.loadItems, exceptionHandler:exceptionHandler});
				$(button).bind("click",  $.proxy(scope._collapse, scope));
			}
		);
		this.expanded = true;
	},
	_collapse:function(){
		$(this.button).unbind("click");
		var scope = this;
		var button = this.button;
		this.removeItems();
		
		$(this).animate({ width:"0px", queue:false}, 250, function(){
				$(button).bind("click", $.proxy(scope._expand, scope));
			}
		);
		this.expanded = false;
	},
	loadItems:function(itemConfigs){
		
		for(var i in itemConfigs){
			this.addItem(New("item", itemConfigs[i], this));
		}
	},
	_getWidthOffset: function(){
		var notStarted = this.layout.getNotStartedColumn();
		
		if(this.drawerType == this.layout.DRAWERTYPES.UCB){
			return notStarted.jq.offset().left + notStarted.jq.width();
		}else {
			return notStarted.jq.offset().left;
		}
	},
	_getHeightOffset: function(){
		return parseInt(this.jq.css("margin-top").replace("px",""));
	},
	redraw: function() {
		if(this.expanded){
			this.jq.width($(window).width() - this._getWidthOffset() + "px");
			this.jq.height($(window).height() - this._getHeightOffset() + "px");
			
			for(var i in this.items){
				this.items[i].redraw();
			}
		}
	}
});