package com.scrumwall.gwt.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DeckPanel;
import com.google.gwt.user.client.ui.Widget;

public class Column extends Composite {

	private static ColumnUiBinder binder = GWT.create(ColumnUiBinder.class);
	
	@UiField
	protected DeckPanel columnNameArea;

	@UiTemplate("Column.ui.xml")
	interface ColumnUiBinder extends UiBinder<Widget, Column> {
	}
	
	public Column(){
		initWidget(binder.createAndBindUi(this));
		columnNameArea.showWidget(0);
	}

}
