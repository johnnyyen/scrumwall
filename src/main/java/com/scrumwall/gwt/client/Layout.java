package com.scrumwall.gwt.client;

import com.allen_sauer.gwt.dnd.client.PickupDragController;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.RootPanel;
import com.scrumwall.gwt.client.ui.Container;
import com.scrumwall.gwt.client.ui.Menu;
import com.scrumwall.gwt.client.ui.RecycleBin;

public class Layout implements EntryPoint {

	@UiField 
	protected Menu menu;
	
	@UiField
	protected Container container;
	
	@UiField
	protected RecycleBin recycleBin;
	
	interface Binder extends UiBinder<FlowPanel, Layout> { }
	
	private static final Binder binder = GWT.create(Binder.class);
	
	public void onModuleLoad() {
		
		FlowPanel panel = binder.createAndBindUi(this);
		
		PickupDragController dragController = new PickupDragController(RootPanel.get(), true);
		//initiate dragging only when mouse has been dragged for at least 1 px
		//This allows registering custom onClick events
		dragController.setBehaviorDragStartSensitivity(1);
		dragController.setBehaviorBoundaryPanelDrop(false);
		
		Window.enableScrolling(false);
		RootPanel.get().add(panel);
		
		container.setDragController(dragController);
		container.initialize();
		
		recycleBin.setDragController(dragController);
		recycleBin.initialize();
	}
}
