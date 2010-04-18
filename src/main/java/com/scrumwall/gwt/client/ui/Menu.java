package com.scrumwall.gwt.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class Menu extends Composite{
	
	@UiTemplate("Menu.ui.xml")
	interface Binder extends UiBinder<Widget, Menu>{};
	private static final Binder binder = GWT.create(Binder.class);
	
	@UiField Button ucbButton;
	
	public Menu(){
		initWidget(binder.createAndBindUi(this));
	}
}
