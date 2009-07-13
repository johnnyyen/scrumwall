
scrumwall.create("item", {
	
	init:function(config, cols){
		
		this.el = $.create("div",{"class":"item"});	
		this.el.guid = "i"+config.id;
		this.el.saveUrl = config.url;
		
		$(this.el).draggable();
		
		//the text displayed in item.
		//use separate containers for collapsed and expanded mode
		this.el.contentText = $.create("div",{"class":"itemText"});
		if(config.content){
			$(this.el.contentText).text(config.content);
		}else{
			$(this.el.contentText).text("I am a new item. Double click me");
		}
		this.el.content = $.create("textarea",{"class":"itemContent hidden"});
		
		this.el.estimate = $.create("input",{"type":"text","class":"estimate"})
		if(config.estimate){
			$(this.el.estimate).attr("value",config.estimate);
		}
		
		var estLabel = $.create("span",{"class":"label"});
		$(estLabel).text("est.");
		var estWrapper = $.create("div",{"class":"estWrapper"});
		
		this.el.owner = $.create("input",{"type":"text","class":"owner"});
		$(this.el.owner).attr("value", config.owner);
		
		//set the initial position of item
		if(cols && cols.length > config.column){
			var col = cols[config.column];
			col.addItem(this.el, col.col);
			var pos = $(col.col).offset();
			var x = 0;
			var y = 0;
			if(config.offsetX){
				x = config.offsetX * $(col.col).width() / 100;
			}
			if(config.offsetY){
				y = config.offsetY * $(col.col).height() / 100;;
			}
			
			pos.left = pos.left + x;
			pos.top = pos.top + y;
			
			$(this.el).css({left:pos.left + "px",top:pos.top+ "px"});
			
		}
		
		//FIXME: this needs to be replaced by some other heuristic of detecting when the item needs to be collapsed 
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
		$(item).width(120);
		$(item).height(100);
		$(item.content).addClass("hidden");
		$(item.contentText).removeClass("hidden");
		$(item.contentText).text($(item.content).attr("value"));
		$(item.collapseButton).addClass("hidden");
	},
	save:function(){
		
	}
	
});