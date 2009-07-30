
scrumwall.create("item", {
	
	initialize:function(config, cols){
		this.guid = "i"+config.id;
		this.saveUrl = config.url;
		$(this).draggable();
		
		this.sprintId=config.sprintId;
		//the text displayed in item.
		//use separate containers for collapsed and expanded mode
		this.contentText = $.create("div",{"class":"itemText"});
		if(config.content){
			$(this.contentText).text(config.content);
		}else{
			$(this.contentText).text("I am a new item. Double click me");
		}
		this.content = $.create("textarea",{"class":"itemContent hidden"});
		$(this.content).val(config.content)
		this.estimate = $.create("input",{"type":"text","class":"estimate"})
		if(config.estimate){
			$(this.estimate).attr("value",config.estimate);
		}
		
		var estLabel = $.create("span",{"class":"label"});
		$(estLabel).text("est.");
		var estWrapper = $.create("div",{"class":"estWrapper"});
		
		this.owner = $.create("input",{"type":"text","class":"owner"});
		$(this.owner).attr("value", config.owner);
		
		//set the initial position of item
		if(cols && cols.length > config.column){
			var col = cols[config.column];
			col.addItem(this);
			var pos = $(col).offset();
			var x = 0;
			var y = 0;
			if(config.offsetX){
				x = config.offsetX * $(col).width() / 100;
			}
			if(config.offsetY){
				y = config.offsetY * $(col).height() / 100;;
			}
			
			pos.left = pos.left + Math.round(x);
			pos.top = pos.top + Math.round(y);
			
			$(this).css({left:pos.left + "px",top:pos.top+ "px"});
		}
		
		//FIXME: this needs to be replaced by some other heuristic of detecting when the item needs to be collapsed 
		this.collapseButton = $.create("input",{"type":"button","value":"Collapse","class":"collapseButton hidden"});
		
		//update DOM with item
		$(estWrapper).append(estLabel);
		$(estWrapper).append(this.estimate);
		$("body").append($(this));
		$(this).append($(this.contentText));
		$(this).append($(this.content));
		$(this).append($(this.owner));
		$(this).append($(estWrapper));
		$(this).append($(this.collapseButton));
		
		$(this).show();
		
		//add event listeners
		$(this.collapseButton).bind("click",{item:this},this.collapse);
		$(this).dblclick(this.expand);
		$(this).blur(this.collapse);
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
	saveable:function(){
		var coords = this.getRelativeCoords();
		return {id: this.guid.replace("i",""),
			column: this.column.id.replace("col",""),
			content: $(this.content).val(),
			estimation: this.estimate.value,
			offsetX: coords.left,
			offsetY: coords.top,
			owner: this.owner.value,
			sprintId: this.sprintId}
	},
	save:function(){
		ItemService.save(this.saveable(),{exceptionHandler:exceptionHandler});
		
	},
	setColumn:function(column){
		this.column = column;
	},
	getRelativeCoords:function(){
		var columnOffsets = $(this.column).offset();
		var columnLeft = columnOffsets.left;
		var columnTop = columnOffsets.top;
		var itemOffsets = $(this).offset();
		var itemLeft = itemOffsets.left;
		var itemTop = itemOffsets.top;
		
		var offsetTop = itemTop - columnTop;
		var offsetLeft = itemLeft - columnLeft;
		
		var columnHeight = $(this.column).height();
		var columnWidth = $(this.column).width();
		
		var relativeTop = offsetTop / columnHeight * 100;
		var relativeLeft = offsetLeft / columnWidth * 100;
		return {top: relativeTop, left: relativeLeft}
	}
	
});