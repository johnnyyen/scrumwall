
create("item", {
	DEFAULT_WIDTH: 120,
	DEFAULT_HEIGHT: 100,
	DEFAULT_TEXT: "Task desctiption goes here",
	initialize:function(config, cols){
		map(config, this);
		this.guid =  config.id !== "undefined" && config.id > -1 ? "item." + config.id : "new." + itemCount;

		if(this.coords) {
			this.setRelativeCoords(this.coords);
		}
		
		if(config.width){
			this.width = config.width;
			this.height = config.height;
		}else{
			this.width = this.DEFAULT_WIDTH;
			this.height = this.DEFAULT_HEIGHT;
		}
		
		
		this._initDOM();
		this._initEvents();
		
		//set the initial position of item and draw it. has to be after dom is 
		//created and events are bound 
		if(cols && cols.length > config.column){
			this.column = cols[config.column];
			if(this.column){
				this.column.addItem(this);
			}
		}
		
		this.redraw();
	},
	_initDOM:function(){
		this.jq = $(this);
		this.contentElement = $.create("textarea",{"class":"itemContent hidden"});
		var contentJq = $(this.contentElement);
		
		this.contentText = $.create("div",{"class":"itemText"});
		var contentTextJq = $(this.contentText);
		
		if(this.guid.indexOf("new.") < 0){
			contentTextJq.text(this.content);
			contentJq.val(this.content);
		}else{
			var newItemText = this.DEFAULT_TEXT;
			contentTextJq.text(newItemText);
			contentJq.val(newItemText);
		}
		
		this.estimationElement = $.create("input",{"maxlength":"2","type":"text","class":"estimation"});
		var estimationJq = $(this.estimationElement); 
		estimationJq.val(this.estimation);
		
		this.hoursLeftElement = $.create("input",{"maxlength":"2", "type":"text", "class": "estimation"});
		var hoursLeftJq = $(this.hoursLeftElement);
		hoursLeftJq.val(this.hoursLeft);
		
		var estWrapper = $.create("div",{"class":"estWrapper"});
		var estWrapperJq = $(estWrapper);
		this.ownerElement = $.create("input",{"type":"text","class":"owner"});
		var ownerJq = $(this.ownerElement).attr("value", this.owner);
		
		$("body").append(this.jq);
		this.expander = $.create("div",{"class":"expandIcon"});
		this.jq.append(contentTextJq).append(contentJq).append(this.expander).
			append(ownerJq).append(estWrapperJq);
		estWrapperJq.append(hoursLeftJq).append(estimationJq);

		$(this.contentElement).bind("keypress", {}, this.onKeyPress, this);
		
		this.paint(this.jq.children(), this, this.color);
		this.jq.css("background-color", this.color);
		
		this.jq.width(this.width).height(this.height);
		
	},
	_initEvents:function(){
		$(this.expander).bind("click", {}, this.expand, this);
		$(this.contentElement).bind("blur", this, this.save );
		$(this.contentElement).bind("dblclick", this, function(event){event.stopPropagation()} );
		this.jq.bind("dblclick", {}, this.expand, this);
		this.jq.draggable();
		$(this.estimationElement).bind("blur", this, this.save );
		$(this.hoursLeftElement).bind("blur", this, this.save);
		$(this.ownerElement).bind("change", this, this.save );
		this.jq.resizable({minHeight:100, minWidth:120, stop: this.onResizeStop});
		
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
		var scope = this;
		
		$(this.expander).unbind("click");
		if(this.width < 300 && this.height < 300){
			$(this).animate( { width:"300px"}, {queue:false, duration:250})
				.animate( {height: "300px"}, {queue: false, duration:250,
					step:function(){
						$(scope.expander).bind("click", {}, scope.collapse, scope);
					}
				}
			);
		}else if(this.width < 300){
			$(this).animate( { width:"300px"}, {queue: false, duration:250,
				step:function(){
					$(scope.expander).bind("click", {}, scope.collapse, scope);
				}
			}
		);
		}else if(this.height < 300){
			$(this).animate( { height:"300px"}, {queue: false, duration:250,
				step:function(){
					$(scope.expander).bind("click", {}, scope.collapse, scope);
				}
			}
		);
		}else{
			$(this.expander).bind("click", {}, this.collapse, scope);
		}
		$(this.contentElement).removeClass("hidden");
		$(this.contentElement).attr("value", $(this.contentText).text());
		$(this.contentText).addClass("hidden");
		
		$(this.contentElement).focus();
		if($(this.contentElement).val() == this.DEFAULT_TEXT){
			$(this.contentElement).select();
		}
		
	},
	collapse:function(event){
		var scope = this;
		$(this.expander).unbind("click");
		
		$(this).animate( { width: this.width + "px"}, {queue:false, duration: 250})
			.animate( {height: this.height + "px"}, {queue: false, duration: 250,
				step:function(){
					$(scope.expander).bind("click", {}, scope.expand, scope);
				}
			}
		);
		
		$(this.contentElement).addClass("hidden");
		$(this.contentText).removeClass("hidden");
		$(this.contentText).text($(this.contentElement).attr("value"));
		
	},
	onKeyPress: function(event){
		if(event.keyCode == $.ui.keyCode.ESCAPE){
			event.preventDefault();
			this.collapse();
			this.save();
		}
	},
	saveable:function(scope){
		if(!scope) scope = this;
		scope.setRelativeCoords();
		
		var item = {column: scope.column.guid,
			content: $(scope.contentElement).val(),
			estimation: scope.estimationElement.value == "" ? null : scope.estimationElement.value,
			offsetX: scope.offsetX,
			offsetY: scope.offsetY,
			owner: scope.ownerElement.value,
			sprintId: scope.sprintId,
			color: scope.color,
			hoursLeft: scope.hoursLeftElement.value == "" ? null : scope.hoursLeftElement.value,
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
				{"scope": scope, callback:scope.saveCallback,exceptionHandler:exceptionHandler});
		
		
	},
	saveCallback:function(item){
		delete this.column.items[this.guid];
		this.guid = "item." + item.id;
		this.column.addItem(this);
		this.id = item.id;
	},
	remove:function(){
		var id = this.saveable().id;
		if(id && id > -1){
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
	_newPosition: function() {
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
		return pos;
	}, 
	redraw: function(){		
		var pos = this._newPosition();		
		this.jq.css({left:pos.left + "px",top:pos.top+ "px"});
	},
	animatedRedraw: function(){
		var pos = this._newPosition();
		this.jq.animate( { top: pos.top + "px"}, {queue:false, duration: 1250})
		.animate( {left: pos.left + "px"}, {queue: false, duration: 1250});
	}
	
	
});