
scrumwall.create("item", {
	
	initialize:function(config, cols){
		var FIX_SPRINT_ID=1;
		this.guid = "i"+config.id;
		this.saveUrl = config.url;
		$(this).draggable();
		
		this.sprintId=config.sprintId ? config.sprintId : FIX_SPRINT_ID;
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
		this.estimation = $.create("input",{"maxlength":"2","type":"text","class":"estimation"})
		if(config.estimation){
			$(this.estimation).val(config.estimation);
		}
		
		this.expander = $.create("div",{"class":"expandIcon"});
		
		var estLabel = $.create("span",{"class":"label"});
		var estWrapper = $.create("div",{"class":"estWrapper"});
		
		this.owner = $.create("input",{"type":"text","class":"owner"});
		$(this.owner).attr("value", config.owner);
		this.offsetX = config.offsetX;
		this.offsetY = config.offsetY;
		//set the initial position of item
		if(cols && cols.length > config.column){
			this.col = cols[config.column];
			this.col.addItem(this);
			this.redraw();
		}
		
		//update DOM with item
		$(estWrapper).append(estLabel);
		$(estWrapper).append(this.estimation);
		$("body").append($(this));
		$(this).append($(this.contentText));
		$(this).append($(this.content));
		$(this).append($(this.expander));
		$(this).append($(this.owner));
		$(this).append($(estWrapper));
		
		$(this).show();
		
		//add event listeners
		$(this.expander).bind("click", {parent: this, object:this}, this.expand);
		$(this).bind("dblclick", {parent: this, object: this.expander}, this.expand);
	},
	expand:function(event){
		var parent = event.data.parent;
		var object = event.data.object;
		$(parent).width(300);
		$(parent).height(300);
		$(parent.content).removeClass("hidden");
		$(parent.contentText).addClass("hidden");
		$(parent.content).attr("value", $(parent.contentText).text());
		$(object).unbind("click", parent.expand);
		$(object).bind("click", {"parent": parent, "object": object}, parent.collapse);
	},
	collapse:function(event){
		var parent = event.data.parent;
		var object = event.data.object;
		$(parent).width(120);
		$(parent).height(100);
		$(parent.content).addClass("hidden");
		$(parent.contentText).removeClass("hidden");
		$(parent.contentText).text($(parent.content).attr("value"));
		$(object).unbind("click", parent.collapse);
		$(object).bind("click", {"parent": parent, "object": object}, parent.expand);
	},
	saveable:function(){
		var coords = this.getRelativeCoords();
		this.offsetX = coords.left;
		this.offsetY = coords.top;
		return {id: this.guid.replace("i",""),
			column: this.column.id.replace("col",""),
			content: $(this.content).val(),
			estimation: this.estimation.value,
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
	},
	redraw: function(){
		
		var pos = $(this.col).offset();
		var x = 0;
		var y = 0;
		if(this.offsetX){
			x = this.offsetX * $(this.col).width() / 100;
		}
		if(this.offsetY){
			y = this.offsetY * $(this.col).height() / 100;;
		}
		
		pos.left = pos.left + Math.round(x);
		pos.top = pos.top + Math.round(y);
		
		$(this).css({left:pos.left + "px",top:pos.top+ "px"});
	}
	
});