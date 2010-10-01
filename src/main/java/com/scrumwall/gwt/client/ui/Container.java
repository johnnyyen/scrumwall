package com.scrumwall.gwt.client.ui;

import java.util.List;

import com.allen_sauer.gwt.dnd.client.PickupDragController;
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
	private PickupDragController dragController;
	
	@UiField
	protected FlowPanel columnContainer;
	
	public void initialize(){
		
		//TODO: no sprints yet
		columnService.getColumns(0, new AsyncCallback<List<ColumnDTO>>() {

			@Override
			public void onFailure(Throwable arg0) {
				// TODO Auto-generated method stub
				throw new UnsupportedOperationException("Can't fail");
			}

			@Override
			public void onSuccess(List<ColumnDTO> columns) {
				for (ColumnDTO column : columns) {
					columnContainer.add(new Column(column, dragController));
				}
			}
		});
	}

	public Container(){
		initWidget(binder.createAndBindUi(this));
	}
	
	public void setDragController(PickupDragController dragController) {
		this.dragController = dragController;
	}
}
