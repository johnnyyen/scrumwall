scrumwall.create("menu",{
	init:function(){
		this.owner = $("#ownerInput");
		this.owner.focus(this.clearOwner);
		this.owner.blur(this.onOwnerBlur);
		this.ucb = $("#ucbButton");
		$(this.ucb).bind("click", {"scope":this}, this.onUcbExpand);
		
	},
	clearOwner:function(){
		
		if(!$(this).attr("value") || $(this).attr("value") == "Your name"){
			$(this).removeAttr("value");
		}
	},
	onOwnerBlur:function(){
		if(!$(this).attr("value") || $(this).attr("value").length == 0){
			$(this).attr("value","Your name");
		}
		
	},
	onUcbExpand:function(event){
		var scope = event.data.scope;
		scope.ucbDiv = $.create("div",{"class": "ucbInitial"});
		var notStarted = $("div[id=col.0]");
		var offset = $(notStarted).offset().left + $(notStarted).width();
		var ucbWidth = $(window).width() - offset;
		$("body").append(scope.ucbDiv); 	
		$(scope.ucbDiv).animate( { width:parseInt(ucbWidth)+"px" }, { queue:false, duration:250 } );
		
		$(this).unbind("click");
		$(this).bind("click", {"scope":scope}, scope.onUcbCollapse);
		//ItemService.getUcbItems({scope: this, callback:this.loadUcbItems, exceptionHandler:exceptionHandler});
	},
	onUcbCollapse:function(event){
		var scope = event.data.scope;
		$(scope.ucbDiv).animate({ width:"hide"}, {queue:false, duration:250} , 
				function(){$(scope.ucbDiv).remove();});
		$(this).unbind("click");
		$(this).bind("click",{"scope":scope},scope.onUcbExpand);
	},
	loadUcbItems:function(items){
		for(var i in items){
			var item = newItem(items[i]);
			item.setColumn(this.ucbDiv);
		}
		
	}
});