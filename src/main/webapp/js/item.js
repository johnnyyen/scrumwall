
scrumwall.create("item", {
	initialize:function(config, cols){
		var FIX_SPRINT_ID=1;
		this.guid =  config.id ? "item." + config.id : "new." + itemCount;
		this.saveUrl = config.url;
		$(this).draggable();
		$(this).resizable({minHeight:100, minWidth:120, stop: this.onResizeStop});
		
		//FIXME use real sprints
		this.sprintId=FIX_SPRINT_ID;
		this.content = $.create("textarea",{"class":"itemContent hidden"});
		$(this.content).bind("blur", this, this.save );
		//the text displayed in item.
		//use separate containers for collapsed and expanded mode
		this.contentText = $.create("div",{"class":"itemText"});
		if(config.id){
			$(this.contentText).text(config.content);
			$(this.content).val(config.content);
		}else{
			var newItemText = "I am a new item. Double click me";
			$(this.contentText).text(newItemText);
			$(this.content).val(newItemText);
		}
		this.estimation = $.create("input",{"maxlength":"2","type":"text","class":"estimation"});
		
		$(this.estimation).val(config.estimation);
		$(this.estimation).bind("blur", this, this.save );
		
		this.hoursLeft = $.create("input",{"maxlength":"2", "type":"text", "class": "estimation"});
		$(this.hoursLeft).val(config.hoursLeft);
		$(this.hoursLeft).bind("blur", this, this.save);
		
		this.expander = $.create("div",{"class":"expandIcon"});
		
		var estWrapper = $.create("div",{"class":"estWrapper"});
		
		this.owner = $.create("input",{"type":"text","class":"owner"});
		$(this.owner).attr("value", config.owner);
		$(this.owner).bind("blur", this, this.save );
		
		this.offsetX = config.offsetX;
		this.offsetY = config.offsetY;
		//set the initial position of item
		if(cols && cols.length > config.column){
			this.col = cols[config.column];
			this.col.addItem(this);
			this.redraw();
		}

		//update DOM with item
		$(estWrapper).append(this.hoursLeft);
		$(estWrapper).append(this.estimation);
		$("body").append($(this));
		$(this).append($(this.contentText));
		$(this).append($(this.content));
		$(this).append($(this.expander));
		$(this).append($(this.owner));
		$(this).append($(estWrapper));

		this.color = config.color;
		this.paint($(this).children(), this, this.color);
		$(this).css("background-color", this.color);
		$(this).show();
		
		if(config.width){
			this.width = config.width;
			this.height = config.height;
		}else{
			//FIXME: use a constant instead
			this.width = 120;
			this.height = 100;
		}
		
		$(this).width(this.width);
		$(this).height(this.height);
		//add event listeners
		$(this.expander).bind("click", {parent: this, object:this.expander}, this.expand);
		$(this).bind("dblclick", {parent: this, object: this.expander}, this.expand);
	},
	onResizeStop:function(event, ui){
		var item = ui.helper[0];
		item.width = ui.size.width;
		item.height = ui.size.height;
		item.save();
	},
	paint:function(children, scope, color){
		children.each( function() {
				$(this).css("background-color", color);
				scope.paint($(this).children(), scope, color);
		});
		 
	},
	expand:function(event){
		var parent = event.data.parent;
		var object = event.data.object;
		$(object).unbind("click");
		if(parent.width < 300 && parent.height < 300){
			$(parent).animate( { width:"300px"}, {queue:false, duration:250})
				.animate( {height: "300px"}, {queue: false, duration:250,
					step:function(){
						$(object).bind("click", {"parent": parent, "object": object}, parent.collapse);
					}
				}
			);
		}else if(parent.width < 300){
			$(parent).animate( { width:"300px"}, {queue: false, duration:250,
				step:function(){
					$(object).bind("click", {"parent": parent, "object": object}, parent.collapse);
				}
			}
		);
		}else if(parent.height < 300){
			$(parent).animate( { height:"300px"}, {queue: false, duration:250,
				step:function(){
					$(object).bind("click", {"parent": parent, "object": object}, parent.collapse);
				}
			}
		);
		}else{
			$(object).bind("click", {"parent": parent, "object": object}, parent.collapse);
		}
		$(parent.content).removeClass("hidden");
		$(parent.contentText).addClass("hidden");
		$(parent.content).attr("value", $(parent.contentText).text());
		
		
	},
	collapse:function(event){
		var parent = event.data.parent;
		var object = event.data.object;
		$(object).unbind("click");
		
		$(parent).animate( { width: parent.width + "px"}, {queue:false, duration: 250})
			.animate( {height: parent.height + "px"}, {queue: false, duration: 250,
				step:function(){
					$(object).bind("click", {"parent": parent, "object": object}, parent.expand);
				}
			}
		);
		
		$(parent.content).addClass("hidden");
		$(parent.contentText).removeClass("hidden");
		$(parent.contentText).text($(parent.content).attr("value"));
		
	},
	saveable:function(scope){
		if(!scope) scope = this;
		scope.setRelativeCoords();
		
		var item = {column: scope.column.guid,
			content: $(scope.content).val(),
			estimation: scope.estimation.value == "" ? null : scope.estimation.value,
			offsetX: scope.offsetX,
			offsetY: scope.offsetY,
			owner: scope.owner.value,
			sprintId: scope.sprintId,
			color: scope.color,
			hoursLeft: scope.hoursLeft.value == "" ? null : scope.hoursLeft.value,
			width: scope.width,
			height: scope.height
		};
		var id = scope.guid;
		
		if(id && id.indexOf("item.") >= 0){
			item.id = id.replace("item.", "");
		}
		return item;
	},
	save:function(event){
		var scope = this;
		if(event) {
			scope = event.data;
		}
		ItemService.save(scope.saveable(scope),
				{scope: scope, callback:scope.saveCallback,exceptionHandler:exceptionHandler});
		
		
	},
	saveCallback:function(item){
		this.guid = "item." + item.id;
	},
	remove:function(){
		var id = this.saveable().id;
		if(id){
			ItemService.remove(id,{exceptionHandler:exceptionHandler});
		}
		$(this).remove();
		
	},
	setColumn:function(column){
		this.column = column;
	},
	setRelativeCoords:function(coords){
		coords = this.getRelativeCoords(coords);
		this.offsetX = coords.left;
		this.offsetY = coords.top;
	},
	getRelativeCoords:function(coords){
		
		var columnOffsets = $(this.column).offset();
		var columnLeft = columnOffsets.left;
		var columnTop = columnOffsets.top;
		var itemOffsets = (coords) ? coords : $(this).offset();
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
		
		var pos = $(this.column).offset();
		var x = 0;
		var y = 0;
		if(this.offsetX){
			x = this.offsetX * $(this.column).width() / 100;
		}
		if(this.offsetY){
			y = this.offsetY * $(this.column).height() / 100;;
		}
		
		pos.left = pos.left + Math.round(x);
		pos.top = pos.top + Math.round(y);
		
		$(this).css({left:pos.left + "px",top:pos.top+ "px"});
	}
	
});