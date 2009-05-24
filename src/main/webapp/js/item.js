
scrumwall.create("item", {
	
	init:function(parentEl,id,owner){
		var pos = $(parentEl).offset();
		
		this.el = $.create("div",{"class":"item"});	
		this.el.guid = "i"+id;
		
		$(this.el).css({left:pos.left + "px",top:pos.top+ "px"});
		$(this.el).draggable();
		
		//the text displayed in item.
		//use separate containers for collapsed and expanded mode
		this.el.contentText = $.create("div",{"class":"itemText"});
		$(this.el.contentText).text("I am a new item. Double click me");
		this.el.content = $.create("textarea",{"class":"itemContent hidden"});
		
		//construct estimate
		this.el.estimate = $.create("input",{"type":"text","class":"estimate"})
		var estLabel = $.create("span",{"class":"label"});
		$(estLabel).text("est.");
		var estWrapper = $.create("div",{"class":"estWrapper"});
		
		this.el.owner = $.create("input",{"type":"text","class":"owner"});
		$(this.el.owner).attr("value", owner);
		
		//FIXME: this needs to be replaced by some other heuristic 
		//of detecting when the item needs to be collapsed 
		this.el.collapseButton = $.create("input",{"type":"button","value":"Collapse","class":"collapseButton hidden"});
		
		//update DOM with item
		$(estWrapper).append(estLabel);
		$(estWrapper).append(this.el.estimate);
		$("#menu").append($(this.el));
		$(this.el).append($(this.el.contentText));
		$(this.el).append($(this.el.content));
		$(this.el).append($(this.el.owner));
		$(this.el).append($(estWrapper));
		$(this.el).append($(this.el.collapseButton));
		
		$(this.el).show();
		
		//add event listeners
		$(this.el.collapseButton).bind("click",{item:this.el},this.collapse);
		$(this.el).dblclick(this.expand);
		$(this.el).blur(this.collapse);
	},
	expand:function(event){
		$(this).width(300);
		$(this).height(300);
		$(this.content).removeClass("hidden");
		$(this.contentText).addClass("hidden");
		$(this.content).attr("value", $(this.contentText).text());
		$(this.collapseButton).removeClass("hidden");
	},
	collapse:function(event){
		var item = event.data.item;
		$(item).width(100);
		$(item).height(100);
		$(item.content).addClass("hidden");
		$(item.contentText).removeClass("hidden");
		$(item.contentText).text($(item.content).attr("value"));
		$(item.collapseButton).addClass("hidden");
	},
	save:function(){
		
	}
	
});