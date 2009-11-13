
create("item", {
	DEFAULT_WIDTH: 120,
	DEFAULT_HEIGHT: 100,
	DEFAULT_TEXT: "Task description goes here",
	initialize:function(config, cols){
		map(config, this);
		this.guid =  config.id !== "undefined" && config.id > -1 ? "item." + config.id : "new." + itemCount;

		if(this.coords) {
			this.setRelativeCoords(this.coords);
		}
		
		if(!config.width){
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
			} else {
				//FIXME: What to do when the column that this item is supposed to be in, is missing.
				alert("item tried to be in column " + config.column + " which does not exist");
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
			contentTextJq.text(this.DEFAULT_TEXT);
			contentJq.val(this.DEFAULT_TEXT);
		}
		
		this.estimationElement = $.create("input",{"maxlength":"2","type":"text","class":"estimation"});
		var estimationJq = $(this.estimationElement); 
		estimationJq.val(this.estimation);
		
		this.hoursLeftElement = $.create("input",{"maxlength":"2", "type":"text", "class": "estimation"});
		var hoursLeftJq = $(this.hoursLeftElement);
		hoursLeftJq.val(this.hoursLeft);
		
		var estimationWrapper = $.create("div",{"class":"estimationWrapper"});
		var estimationWrapperJq = $(estimationWrapper);
		this.ownerElement = $.create("input",{"type":"text","class":"owner"});
		this.setOwner(this.owner);
		
		$("body").append(this.jq);
		this.expander = $.create("div",{"class":"expandIcon"});
		this.jq.append(contentTextJq)
			.append(contentJq)
			.append(this.expander)
			.append($(this.ownerElement))
			.append(estimationWrapperJq);
		estimationWrapperJq.append(hoursLeftJq)
			.append(estimationJq);
		
		this.paint(this.jq.children(), this, this.color);
		this.jq.css("background-color", this.color);
		
		this.jq.width(this.width).height(this.height);
		
	},
	_initEvents:function(){
		
		this.jq.bind("dblclick", {}, this.expand, this);
		this.jq.draggable({revert: "invalid"});
		this.jq.resizable({minHeight:100, minWidth:120, stop: this.onResizeStop});
		
		$(this.contentElement).bind("blur", {}, this.save, this );
		$(this.contentElement).bind("dblclick", {}, function(event){event.stopPropagation();} );
		$(this.contentElement).bind("keypress", {}, this.collapseAndSaveOrCancel, this);
		$(this.estimationElement).bind("change", {}, this.save, this );
		$(this.estimationElement).bind("dblclick", {}, function(event){event.stopPropagation();} );
		$(this.hoursLeftElement).bind("change", {}, this.save, this);
		$(this.hoursLeftElement).bind("dblclick", {}, function(event){event.stopPropagation();} );
		$(this.ownerElement).bind("change", {}, this.ownerChanged, this );
		$(this.ownerElement).bind("dblclick", {}, function(event){event.stopPropagation();} );
		//TODO: remove the expander
		$(this.expander).bind("click", {}, this.expand, this);		
	},
	ownerChanged: function(){
		this.setOwner($(this.ownerElement).val());
		this.save();
	},
	setOwner: function(ownerName) {
		if(this.column.columnType == this.column.DRAWER || 
				$.trim($(this.ownerElement).val()) == "") {
			$(this.ownerElement).val(ownerName);
			this.owner = ownerName;
		}
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
		
		//FIXME: Currently the step event is called lots of times.
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
			$(this.expander).bind("click", {}, this.collapse, this);
		}
		$(this.contentElement).show();
		$(this.contentElement).val($(this.contentText).text());
		$(this.contentText).hide();
		
		$(this.contentElement).focus();
		if($(this.contentElement).val() == this.DEFAULT_TEXT){
			$(this.contentElement).select();
		}
		
		this._storeCurrentState();
		
		$(this.estimationElement).bind("keypress", {}, this.collapseAndSaveOrCancel, this);
		$(this.hoursLeftElement).bind("keypress", {}, this.collapseAndSaveOrCancel, this);
		$(this.ownerElement).bind("keypress", {}, this.collapseAndSaveOrCancel, this);

	},
	_storeCurrentState: function(){
		this.previousContent = $(this.contentElement).val();
		this.previousOwner = $(this.ownerElement).val();
		this.previousHours = $(this.hoursLeftElement).val();
		this.previousEstimation = $(this.estimationElement).val();
	},
	_restorePreviousState: function(){
		$(this.contentElement).val(this.previousContent);
		$(this.contentElement).focus(); // focus it cause it blurs all other elements. It will not write to
										// a input that has focus.
		$(this.ownerElement).val(this.previousOwner);
		$(this.hoursLeftElement).val(this.previousHours);
		$(this.estimationElement).val(this.previousEstimation);
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
		
		$(this.contentElement).hide();
		$(this.contentText).show();
		$(this.contentText).text($(this.contentElement).attr("value"));
		
		$(this.estimationElement).unbind("keypress");
		$(this.hoursLeftElement).unbind("keypress");
		$(this.ownerElement).unbind("keypress");

	},
	collapseAndSaveOrCancel: function(event){

		var key = event.which || event.keyCode;
		if( key == $.ui.keyCode.ESCAPE){
			event.preventDefault();
			this._restorePreviousState();
			//do not move these outside the if because only the escape and enter needs to be handled 
			this.collapse();
			this.save();

		}
		else if (event.ctrlKey && 
				(key == $.ui.keyCode.ENTER 
				|| key == $.ui.keyCode.NUMPAD_ENTER)){
			event.preventDefault();
			this.collapse();
			this.save();
		}
	},
	_saveable:function(){
		this.setRelativeCoords();
		
		var item = {column: this.column.guid,
			content: $(this.contentElement).val(),
			estimation: this.estimationElement.value == "" ? null : this.estimationElement.value,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			owner: this.ownerElement.value,
			sprintId: this.sprintId,
			color: this.color,
			hoursLeft: this.hoursLeftElement.value == "" ? null : this.hoursLeftElement.value,
			width: this.width,
			height: this.height
		};
		
		if(this.guid.indexOf("item.") >= 0){
			item.id = this.guid.replace("item.", "");
		}
		return item;
	},
	save:function(){
		ItemService.save(this._saveable(),
				{"scope": this, callback:this.saveCallback,exceptionHandler:exceptionHandler});
	},
	saveCallback:function(item){
		delete this.column.items[this.guid];
		this.guid = "item." + item.id;
		this.column.addItem(this);
		this.id = item.id;
	},
	remove:function(){
		var id = this._saveable().id;
		if(id && id > -1) {
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
		return {top: relativeTop, left: relativeLeft};
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
	}
});