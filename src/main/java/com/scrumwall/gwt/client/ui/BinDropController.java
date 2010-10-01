package com.scrumwall.gwt.client.ui;

import com.allen_sauer.gwt.dnd.client.DragContext;
import com.allen_sauer.gwt.dnd.client.drop.SimpleDropController;

public class BinDropController extends SimpleDropController{

	RecycleBin bin;
	
	public BinDropController(RecycleBin bin) {
		super(bin);
		this.bin = bin;
	}
	
	@Override
	public void onDrop(DragContext context) {
		bin.onDrop(context.draggable);
		super.onDrop(context);
	}

	@Override
	public void onEnter(DragContext context) {
		bin.highlight();
		super.onEnter(context);
	}

	@Override
	public void onLeave(DragContext context) {
		bin.unHighlight();
		super.onLeave(context);
	}
	
}
