package com.scrumwall.gwt.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class RecycleBin extends Composite {

	private static RecycleBinUiBinder uiBinder = GWT
			.create(RecycleBinUiBinder.class);

	interface RecycleBinUiBinder extends UiBinder<Widget, RecycleBin> {
	}

	public RecycleBin() {
		initWidget(uiBinder.createAndBindUi(this));
	}

}
