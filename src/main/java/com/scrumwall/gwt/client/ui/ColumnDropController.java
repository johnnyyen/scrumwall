package com.scrumwall.gwt.client.ui;

import com.allen_sauer.gwt.dnd.client.DragContext;
import com.allen_sauer.gwt.dnd.client.drop.AbsolutePositionDropController;

public class ColumnDropController extends AbsolutePositionDropController{
	
	private Column column; 
	
	public ColumnDropController(Column column) {
		super(column.getBody());
		this.column = column;
	}

	@Override
	public void onDrop(DragContext context) {
		super.onDrop(context);
		column.onDrop(context.draggable);
	}

	@Override
	public void onEnter(DragContext context) {
		column.highlight();
		super.onEnter(context);
	}

	@Override
	public void onLeave(DragContext context) {
		column.unHighlight();
		super.onLeave(context);
	}
	
	@Override
	public void onMove(DragContext context){
		super.onMove(context);
		((Item)context.draggable).disableEditing();
	}
	
}
