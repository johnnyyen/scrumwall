package com.scrumwall.gwt.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class Container extends Composite{
	@UiTemplate("Container.ui.xml")
	interface Binder extends UiBinder<Widget, Container>{};
	private static final Binder binder = GWT.create(Binder.class);
	
	
	public Container(){
		initWidget(binder.createAndBindUi(this));
	}

}
