package com.scrumwall.gwt.client.ui;

import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.Widget;
import com.scrumwall.gwt.client.ColumnService;
import com.scrumwall.gwt.client.ColumnServiceAsync;
import com.scrumwall.gwt.shared.ColumnDTO;

public class Container extends Composite{
	@UiTemplate("Container.ui.xml")
	interface Binder extends UiBinder<Widget, Container>{};
	private static final Binder binder = GWT.create(Binder.class);
	
	private final ColumnServiceAsync columnService = GWT.create(ColumnService.class); 
	
	private List<ColumnDTO> columns;
	@UiField
	protected FlowPanel columnContainer;
	
	public Container(){
		columnService.getColumns(0, new AsyncCallback<List<ColumnDTO>>() {

			@Override
			public void onFailure(Throwable arg0) {
				// TODO Auto-generated method stub
				throw new UnsupportedOperationException("Can't fail");
			}

			@Override
			public void onSuccess(List<ColumnDTO> cols) {
				columns = cols;
				for (ColumnDTO column : columns) {
					columnContainer.add(new Column(column));
				}
			}
		});
		
		
		
		initWidget(binder.createAndBindUi(this));
	}

}
