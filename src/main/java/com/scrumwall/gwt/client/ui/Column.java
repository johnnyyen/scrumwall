package com.scrumwall.gwt.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiConstructor;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DeckPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.Widget;
import com.scrumwall.gwt.shared.ColumnDTO;

public class Column extends Composite {

	private static ColumnUiBinder binder;
	
	@UiField protected DeckPanel columnNameArea;

	@UiField protected Label columnName;
	
	private ColumnDTO dto;
	
	public String getName() {
		return dto.getName();
	}
	
	@UiTemplate("Column.ui.xml")
	interface ColumnUiBinder extends UiBinder<Widget, Column> {
	}
	
	@UiConstructor
	public Column(ColumnDTO column){
		this.dto = column;
		binder = GWT.create(ColumnUiBinder.class);
		initWidget(binder.createAndBindUi(this));
		columnName.setText(dto.getName());
		columnNameArea.showWidget(0);
	}
	
}
