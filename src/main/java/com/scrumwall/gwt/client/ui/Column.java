package com.scrumwall.gwt.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiConstructor;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DeckPanel;
import com.google.gwt.user.client.ui.Widget;

public class Column extends Composite {

	private static ColumnUiBinder binder = GWT.create(ColumnUiBinder.class);
	
	@UiField
	protected DeckPanel columnNameArea;

	private int id;
	private String name;
	private int type;
	private int sprintId;

	@UiTemplate("Column.ui.xml")
	interface ColumnUiBinder extends UiBinder<Widget, Column> {
	}
	
	@UiConstructor
	public Column(int id){
		this.id = id;
	}

	public void init() {
		initWidget(binder.createAndBindUi(this));
		columnNameArea.showWidget(0);
	}

	public Column setName(String name) {
		this.name = name;
		return this;
	}

	public Column setType(int type) {
		this.type = type;
		return this;
	}

	public Column setSprintId(int sprintId) {
		this.sprintId = sprintId;
		return this;
	}
	
}
