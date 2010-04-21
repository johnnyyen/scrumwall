package com.scrumwall.gwt.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class Item extends Composite{

	@UiTemplate("Item.ui.xml")
	interface Binder extends UiBinder<Widget, Item>{};
	private static final Binder binder = GWT.create(Binder.class);

	
	public Item(){
		initWidget(binder.createAndBindUi(this));
	}
}
