
create("item", {
	DEFAULT_WIDTH: 120,
	DEFAULT_HEIGHT: 100,
	DEFAULT_TEXT: "Task description goes here",
	DEFAULT_COLOR: "yellow",
	HIGHLIGHT_COLOR: "yellow",
	expanded: false,
	
	initialize:function(config, col){
		map(config, this);
		this.guid =  config.id !== "undefined" && config.id > -1 ? "item_" + config.id : "new_" + itemCount;

		if(this.coords) {
			this.setRelativeCoords(this.coords);
		}
		
		if(!this.color) {
			this.color = this.DEFAULT_COLOR;
		}
		
		if(!config.width){
			this.width = this.DEFAULT_WIDTH;
			this.height = this.DEFAULT_HEIGHT;
		}

        if(col){
		    this.setColumn(col);
        }

        
		this._initDOM();
		this._initEvents();

		this.redraw();
		
		if(this.newItem){
			this.expand();
			this.save();
		}
	},
	_initDOM:function(){
		this.jq = $(this);
		
		this.jq.attr("id",this.guid);
		this.jq.attr("tabindex", "-1");
		
		this.contentElement = $.create("textarea",{"class":"itemContent hidden"});
		var contentJq = $(this.contentElement);
		
		this.contentText = $.create("div",{"class":"itemText", "tabindex":"-1"});
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
		if(this.estimation){
			estimationJq.val(this.estimation);
		}
		
		this.hoursLeftElement = $.create("input",{"maxlength":"2", "type":"text", "class": "hoursLeft"});
		var hoursLeftJq = $(this.hoursLeftElement);
		if(this.hoursLeft){
			hoursLeftJq.val(this.hoursLeft);
		}
		 
		var estimationWrapper = $.create("div",{"class":"estimationWrapper"});
		var estimationWrapperJq = $(estimationWrapper);
		this.ownerElement = $.create("input",{"type":"text","class":"owner"});
		this.setOwner(this.owner);

		$("body").append(this.jq);

		this.expander = $.create("div",{"class":"expandIcon"});
		this.jq.append(contentTextJq)
			.append($($.create("div", {"class": "itemContentWrapper", "tabindex":"-1"})).append(contentJq))
			.append(this.expander)
			.append($(this.ownerElement))
			.append(estimationWrapperJq);
		estimationWrapperJq.append(hoursLeftJq)
			.append(estimationJq);
		
		this.jq.css("background-color", this.color);
		this.jq.width(this.width).height(this.height);
		
	},
	_initEvents:function(){
		
		this.jq.bind("dblclick",  $.proxy(this.expand, this));
		this.jq.draggable({revert: "invalid", start: $.proxy(this.highlight, this)});
		this.jq.resizable({minHeight:100, minWidth:120, stop: this.onResizeStop});
		
		$(this.contentElement).bind("blur", $.proxy(this.save, this ));
		$(this.contentElement).bind("dblclick", function(event){event.stopPropagation();} );
		$(this.contentElement).bind("keyup", $.proxy(this.collapseAndSaveOrCancel, this));
		$(this.estimationElement).bind("change", $.proxy(this.save, this ));
		$(this.estimationElement).bind("dblclick", function(event){event.stopPropagation();} );
		var scope = this;
		$(this.estimationElement).bind("keyup", function(event) {scope.validateNumberAndNotify(scope.estimationElement);});
		$(this.hoursLeftElement).bind("change", $.proxy(this.save, this));
		$(this.hoursLeftElement).bind("dblclick", function(event){event.stopPropagation();} );
		$(this.hoursLeftElement).bind("keyup", function(event) {scope.validateNumberAndNotify(scope.hoursLeftElement);});
		$(this.ownerElement).bind("change", $.proxy(this.ownerChanged, this ));
		$(this.ownerElement).bind("dblclick", function(event){event.stopPropagation();} );
		//TODO: remove the expander
		$(this.expander).bind("click", $.proxy(this.expand, this));
		$(this).bind("click", $.proxy(this.highlight, this));
	},
	highlight: function(event){
		this.column.zIndex++;
		this.jq.css("z-index", this.column.zIndex);
		this.column.layout.highlightItem(this);
		this.highlighted = true;
		this.jq.css("background-color", this.HIGHLIGHT_COLOR);
		this.jq.bind("keyup", this.deleteItem);
		
	},
	unHighlight: function(){
		this.highlighted = false;
		this.jq.css("background-color", this.color);
		this.jq.unbind("keyup", this.deleteItem);
	},
	deleteItem: function(event){
		if(this.highlighted && 
				(event.target.id == this.id 
					|| event.target.className == "itemText"
					|| event.target.className == "itemContentWrapper")){
			var key = event.which || event.keyCode;
			if( key == $.ui.keyCode.DELETE){
				event.preventDefault();
				this.remove();
			}
		}
	},
	ownerChanged: function(){
		this.setOwner($(this.ownerElement).val());
		this.save();
	},
	setOwner: function(ownerName) {
		if(this.column.columnType == this.column.DRAWER || 
				$.trim($(this.ownerElement).val()) == "") {
			$(this.ownerElement).blur();
			$(this.ownerElement).val(ownerName);
			this.owner = ownerName;
		}
	},
	onResizeStop:function(event, ui){
		var item = ui.helper[0];
		
		if(!this.expanded){
			item.width = ui.size.width;
			item.height = ui.size.height;
		}
		item.save();
	},
	expand:function(event){
		this.highlight(event);
		var scope = this;
		
		$(this.expander).unbind("click");
		
		//FIXME: Currently the step event is called lots of times.
		if(this.width < 300 && this.height < 300){
			$(this).animate( { width:"300px"}, {queue:false, duration:250})
				.animate( {height: "300px"}, {queue: false, duration:250,
					step:function(){
						$(scope.expander).bind("click",  $.proxy(scope.collapse, scope));
					}
				}
			);
		}else if(this.width < 300){
			$(this).animate( { width:"300px"}, {queue: false, duration:250,
				step:function(){
					$(scope.expander).bind("click",  $.proxy(scope.collapse, scope));
				}
			}
		);
		}else if(this.height < 300){
			$(this).animate( { height:"300px"}, {queue: false, duration:250,
				step:function(){
					$(scope.expander).bind("click",  $.proxy(scope.collapse, scope));
				}
			}
		);
		}else{
			$(this.expander).bind("click",  $.proxy(this.collapse, this));
		}
		$(this.contentElement).show();
		$(this.contentElement).val($(this.contentText).text());
        $(this.contentText).hide();

		$(this.contentElement).focus();
		if($(this.contentElement).val() == this.DEFAULT_TEXT){
			$(this.contentElement).select();
		}
		
		this._storeCurrentState();
		
		$(this.estimationElement).bind("keyup",  $.proxy(this.collapseAndSaveOrCancel, this));
		$(this.hoursLeftElement).bind("keyup",  $.proxy(this.collapseAndSaveOrCancel, this));
		$(this.ownerElement).bind("keyup",  $.proxy(this.collapseAndSaveOrCancel, this));
		
		this.expanded = true;
        if(event) {
            event.stopPropagation();
        }
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
					$(scope.expander).bind("click",  $.proxy(scope.expand, scope));
				}
			}
		);
		
		$(this.contentElement).hide();
		$(this.contentText).show();
		$(this.contentText).text($(this.contentElement).attr("value"));
		
		$(this.estimationElement).unbind("keypress");
		$(this.hoursLeftElement).unbind("keypress");
		$(this.ownerElement).unbind("keypress");

		this.expanded = false;
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
		
		if(this.guid.indexOf("item_") >= 0){
			item.id = this.guid.replace("item_", "");
		}
		return item;
	},
	save:function(){
		if(this.validateNumberAndNotify(this.estimationElement) 
				&& this.validateNumberAndNotify(this.hoursLeftElement)){
			
			ItemService.save(this._saveable(),
				{"scope": this, callback:this.saveCallback,exceptionHandler:exceptionHandler});
		}
	},
	saveCallback:function(item){
		delete this.column.items[this.guid];
		this.guid = "item_" + item.id;
		this.column.addItem(this);
		this.id = item.id;
		this.jq.attr("id",this.guid);
	},
    remove:function(){
		var id = this._saveable().id;
		if(id && id > -1) {
			ItemService.remove(id,{exceptionHandler:exceptionHandler, 'async': false});
		}
		$(this).remove();
		
	},
	setColumn:function(column){
        $(this).removeClass("ownerColumn_" + $(this.column).attr('id'));
        this.column = column;
        $(this).addClass("ownerColumn_" + $(this.column).attr('id'));
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
		var originalOffsets = $(this).offset();
		var itemOffsets = (coords) ? coords : originalOffsets;
		var itemLeft = itemOffsets.left? itemOffsets.left: originalOffsets.left;
		var itemTop = itemOffsets.top? itemOffsets.top: originalOffsets.top;
		
		var offsetTop = itemTop - columnTop;
		var offsetLeft = itemLeft - columnLeft;
		
		var columnHeight = $(this.column).height();
		var columnWidth = $(this.column).width();
		
		var relativeTop = offsetTop / columnHeight * 100;
		var relativeLeft = offsetLeft / columnWidth * 100;
		return {top: relativeTop, left: relativeLeft};
	},
	_convertPercentToPixels: function() {
		var pos = $(this.column).offset();
		var x = 0;
		var y = 0;
		if(this.offsetX){
			x = this.offsetX * $(this.column).width() / 100;
		}
		if(this.offsetY){
			y = this.offsetY * $(this.column).height() / 100;;
		}
		
		pos.left += Math.round(x);
		pos.top += Math.round(y);
		return pos;
	},
	redraw: function(){		
		var pos = this._convertPercentToPixels();
		this.jq.css({left:pos.left + "px",top:pos.top+ "px"});
	},
	validateNumberAndNotify: function(element){
		//allows full numbers, at most two digits
		if(!/^\d{0,2}$/.test($(element).val())){
			//FIXME: create tooltip
			//console.log($(element).attr('class') + " is invalid");
			return false;
		}
		return true;
	},
	changePosition: function(){
		this.redraw();
        this.save();
	}
});