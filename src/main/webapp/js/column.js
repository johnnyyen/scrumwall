	
createExtending("column", "container", {
	width:0,
	DEFAULT_TEXT: "Double-click to change name",
	REMOVE_MODES:{
		MOVE_LEFT: 1,
		MOVE_RIGHT: 2,
		REMOVE: 3,
		NO_ITEMS: 4
	},
	SPACE_BETWEEN_ITEMS: 5,
	initialize:function(config){
		map(config,this);
		
		this.jq = $(this);
		this.guid = config.id;
		this.items = new Array();

		this.initializeParent();
		
		if(!this.columnType) {
			this.columnType = this.REGULAR;
		}

        if(!this.name) {
            this.name = ""
        }

		this.sprintId = this.layout.getCurrentSprint();
		
		this.zIndex = 100;

		this._initDOM();

        this.loadItems();
	},
	_initDOM:function(){

		this.header = $.create("div",{"class":"colHeader"});
		this.body = $.create("div",{"class":"colBody"});
		this.headerInput = $.create("input", {"type": "text", "class": "columnNameInput"});
		this.headerText = $.create("div", {"class": "columnNameText"});
		
		if(this.columnType == this.DONE) {
			this.jq.addClass("doneColumn");
		} else if(this.columnType == this.IN_PROGRESS) {
            this.jq.addClass("inProgressColumn");
        } else if(this.columnType == this.NOT_STARTED) {
            this.jq.addClass("notStartedColumn");
        }
		
		if(this.guid != undefined){
			this.jq.attr("id", "col_" + this.guid);
		}

		if(this.columnType == this.DONE) {
			this.newColumnButton = $.create("a", {"id": "newColumnButton", "href": "#"});
			$(this.newColumnButton).text("+").bind("click", $.proxy(this.layout.createColumn, this.layout));
			$(this.header).append(this.newColumnButton);
		}
		
		if(this.columnType == this.REGULAR) {
			this.deleteColumnButton = $.create("a", {"class": "deleteColumnButton", "href": "#"});
			$(this.deleteColumnButton).text("X").bind("click", $.proxy(this.deleteColumn, this));
			$(this.header).append(this.deleteColumnButton);
		}
		
		if(this.columnType != this.DONE && this.columnType != this.NOT_STARTED) {
			this.jq.addClass("sortableColumn");
		}
		
		this.jq.css("z-index", getNewZIndex());
		
		this.jq.append($(this.header)).append($(this.body));
		$(this.headerText).text(this.name);
		$(this.header).append($(this.headerInput));
		$(this.header).append($(this.headerText));
		$(this.parent).append(this.jq);
		$(this.headerInput).hide();
		
		$(this.header).bind("dblclick", $.proxy(this._editName, this));
		$(this.headerInput).bind("blur", $.proxy(this._nameEdited, this));
		$(this.headerInput).bind("dblclick", function(event) {event.stopPropagation();});
		$(this.headerInput).bind("keypress", $.proxy(this._nameEdited, this));

		this.jq.droppable({drop:this.onItemDrop, over: this.itemOverContainer,
				tolerance:"intersect",out:this.onDragStop});
		var scope = this;
		
		if(this.columnType != this.DONE) {
			this.jq.resizable({stop: function(){scope.layout.calculatePercentages(); scope.layout.saveAllColumns();},
                containment: 'parent', handles:"e",
                resize: $.proxy(this.resize, this)
            });
		}
	},
	_editName: function(event) {
		$(this.headerText).hide();
		$(this.headerInput).show();
        if($(this.headerText).text() != this.DEFAULT_TEXT) {
            $(this.headerInput).val($(this.headerText).text());
        }
        $(this.headerInput).focus();
		$(this.headerInput).select();
        event.stopPropagation();
	},
	_nameEdited: function(event) {
		var key = event.which || event.keyCode;
		if(event.type == "keypress" && 
				!($.ui.keyCode.ESCAPE == key 
						|| $.ui.keyCode.ENTER == key)) {
			return;
		} else if ($.ui.keyCode.ESCAPE == key) {
			//escape cancels editing
		}else if($.trim($(this.headerInput).val()) == "") {
			$(this.headerText).text(this.DEFAULT_TEXT);
		}else{
			$(this.headerText).text($(this.headerInput).val());
			this.name = $(this.headerText).text(); 
			this.save();
		}
		$(this.headerInput).hide();
		$(this.headerText).show();
	},
	resize:function(){
		var delta = this.jq.width() - this.columnWidth;
		this.columnResize(this.jq.width());
		this.layout.onColumnResize(this.order, delta);
		this.columnWidth = this.jq.width();
	},
	columnResize:function(newWidth, newHeight){
		this.columnWidth = this.jq.width();
		
		if(newWidth){
			this.jq.width(newWidth);
		}
		if(newHeight){
			this.jq.height(newHeight);
		}
		if(newWidth || newHeight){
			this.redraw();
		}
	},
	_saveable:function(){
		var column = {width: this.width,
				name: this.name,
				order: this.order,
				columnType: this.columnType,
				sprintId: this.sprintId
			};
		if(this.guid !== undefined) {
			column.id = this.guid;
		}
		return column;
	},
	save: function(){
		ColumnService.save(this._saveable(), 
				{async: false, scope: this, callback: this._saveCallback, exceptionHandler:exceptionHandler});
	},
	_saveCallback:function(column){
		this.guid = column.id;
		this.id = "col_"+column.id;
	},
	deleteColumn:function(){
		if(count(this.items) > 0){
			this._showRemoveModeDialog();
		}else{
			this._deleteColumn(this.REMOVE_MODES.NO_ITEMS);
		}
	},
	_deleteColumn:function(removeMode) {
		ColumnService.remove(this._saveable(), removeMode, {scope: this, exceptionHandler:exceptionHandler});
		if(removeMode == this.REMOVE_MODES.REMOVE){
			for(var i in this.items){
				this.items[i].remove();
			}
		}
		
		this.layout.deleteColumn(this, removeMode);
	},
	_showRemoveModeDialog:function(){
		var dialog = $.create("div", {"id": "removeMode"});
		var title = "What to do with items in the column?";
		var column = this;
		var buttons = {"Move right": {
                    click: function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.MOVE_RIGHT);},
                    "class": "moveRightButton"},
				"Delete": {
                    click: function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.REMOVE);},
                    "class": "deleteItemsButton"},
				"Move left": {
                    click: function(){$(this).dialog("close");column._deleteColumn(column.REMOVE_MODES.MOVE_LEFT);},
                    "class": "moveLeftButton"}
				};
		$(dialog).dialog({"title":title,"buttons": buttons, closeOnEscape:true,
            resizable:false, draggable:false, modal:true, height:150,width:380,
            position: 'center',
            dialogClass: "dialog"
        });
		$(dialog).bind("dialogclose", 
			function(){
				$(this).dialog("destroy");
				$(dialog).remove();
			});
	},
	drawerExpanded: function(){
		return this.layout.isDrawerExpanded();
	},
    loadItems: function(){
        if(this.id){
            ItemService.getItems(this.guid, {scope: this, callback:this.loadItemsCallback, exceptionHandler:exceptionHandler});
        }
    },
    loadItemsCallback: function(items){
		for(var i = 0; i < items.length; i++){
			this.addItem( New("item", items[i], this));
		}
    },
    alignItems: function(){
    	var leftPos = $(this).offset().left;
    	var topPos = $(this).offset().top + $(this.header).height();
    	var oldTop = topPos;
    	var maxWidth = 0;
    	var itemWidth;
    	var keys = [];
    	for(var key in this.items){
    		keys.push(key);
    	}
    	keys.sort();
    	
    	for(var i=0; i < keys.length; i++){
    		this.items[keys[i]].setRelativeCoords({left: leftPos, top: topPos});
    		this.items[keys[i]].changePosition();
    		itemWidth = $(this.items[keys[i]]).width();
    		if(itemWidth > maxWidth){
    			maxWidth = itemWidth;
    		}
    		if(topPos > $(this).height() - ($(this.items[keys[i]]).height() + this.SPACE_BETWEEN_ITEMS)){
    			topPos = oldTop;
    			leftPos += maxWidth + this.SPACE_BETWEEN_ITEMS;
    		}else{		
    			topPos += $(this.items[keys[i]]).height() + this.SPACE_BETWEEN_ITEMS;
    		}
    	}
    }
});