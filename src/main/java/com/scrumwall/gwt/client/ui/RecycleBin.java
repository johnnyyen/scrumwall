package com.scrumwall.gwt.client.ui;

import com.allen_sauer.gwt.dnd.client.PickupDragController;
import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class RecycleBin extends Composite {

	private static RecycleBinUiBinder uiBinder = GWT.create(RecycleBinUiBinder.class);
	
	private PickupDragController dragController;
	
	interface BinStyle extends CssResource{
		String highlight();
	}
	
	@UiField
	protected BinStyle style;
	
	interface RecycleBinUiBinder extends UiBinder<Widget, RecycleBin> {
	}

	public RecycleBin() {
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	public void initialize(){
		this.dragController.registerDropController(new BinDropController(this));
	}

	public void onDrop(Widget draggable) {
		draggable.removeFromParent();
		
		Item item = (Item)draggable;
		item.delete();
	}

	public void highlight(){
		this.addStyleName(style.highlight());
	}
	
	public void unHighlight(){
		this.removeStyleName(style.highlight());
	}
	
	public void setDragController(PickupDragController dragController) {
		this.dragController = dragController;
	}
}
