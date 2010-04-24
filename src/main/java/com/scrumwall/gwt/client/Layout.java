package com.scrumwall.gwt.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.RootPanel;
import com.scrumwall.gwt.client.ui.Menu;

public class Layout implements EntryPoint {

	@UiField Menu menu;
	
	interface Binder extends UiBinder<FlowPanel, Layout> { }
	
	private static final Binder binder = GWT.create(Binder.class);
	
	public void onModuleLoad() {
		
		FlowPanel panel = binder.createAndBindUi(this);
		
		Window.enableScrolling(false);
		RootPanel.get().add(panel);
		
	}
}
