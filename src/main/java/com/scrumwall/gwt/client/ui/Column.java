package com.scrumwall.gwt.client.ui;

import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiConstructor;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DeckPanel;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.Widget;
import com.scrumwall.gwt.client.ItemService;
import com.scrumwall.gwt.client.ItemServiceAsync;
import com.scrumwall.gwt.shared.ColumnDTO;
import com.scrumwall.gwt.shared.ItemDTO;

public class Column extends Composite {

	private final ItemServiceAsync itemService = GWT.create(ItemService.class); 
	
	private static ColumnUiBinder binder;
	
	@UiField protected DeckPanel columnNameArea;

	@UiField protected Label columnName;
	
	@UiField protected FlowPanel columnBody;
	
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
		final Column instance = this; 
		itemService.getForColumn(dto.getId(), new AsyncCallback<List<ItemDTO>>() {
			@Override
			public void onFailure(Throwable e) {
			}
			@Override
			public void onSuccess(List<ItemDTO> items) {
				for (ItemDTO item : items) {
					columnBody.add(new Item(item, instance));
				}
			}
		});
		binder = GWT.create(ColumnUiBinder.class);
		initWidget(binder.createAndBindUi(this));
		columnName.setText(dto.getName());
		columnNameArea.showWidget(0);
	}

	public int getId() {
		return dto.getId();
	}
	
}
