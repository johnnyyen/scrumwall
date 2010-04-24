package com.scrumwall.gwt.client.ui;

import com.allen_sauer.gwt.dnd.client.PickupDragController;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.DoubleClickEvent;
import com.google.gwt.event.dom.client.DoubleClickHandler;
import com.google.gwt.event.dom.client.HasDoubleClickHandlers;
import com.google.gwt.event.dom.client.HasKeyPressHandlers;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyPressEvent;
import com.google.gwt.event.dom.client.KeyPressHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.ui.DeckPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.Widget;

public class Item extends CompositeDraggable implements HasDoubleClickHandlers, DoubleClickHandler, HasKeyPressHandlers, KeyPressHandler{

	@UiField
	protected DeckPanel contentArea; 
	@UiField
	protected TextArea content;
	@UiField
	protected InlineLabel contentText;
	
	@UiTemplate("Item.ui.xml")
	interface Binder extends UiBinder<Widget, Item>{};
	private static final Binder binder = GWT.create(Binder.class);
	private PickupDragController dragController;
	
	public Item(){
		initWidget(binder.createAndBindUi(this));
		contentArea.showWidget(0);
		dragController = new PickupDragController(RootPanel.get(), true);

		//initiate dragging only when mouse has been dragged for at least 1 px
		//This allows registering custom onClick events
		dragController.setBehaviorDragStartSensitivity(1);
		
		dragController.makeDraggable(this);
		this.addDoubleClickHandler(this);
		content.addKeyPressHandler(this);
		
	}

	@Override
	public void onDoubleClick(DoubleClickEvent event) {
		content.setText(contentText.getText());
		contentArea.showWidget(1);
		content.setFocus(true);
		
	}

	@Override
	public void onKeyPress(KeyPressEvent event) {
		
		if(event.getCharCode() == KeyCodes.KEY_ESCAPE){
			contentArea.showWidget(0);
		}else if(event.isControlKeyDown() && event.getCharCode() == KeyCodes.KEY_ENTER){
			contentText.setText(content.getText());
			contentArea.showWidget(0);
		}
		
	}
	
	public HandlerRegistration addDoubleClickHandler(DoubleClickHandler handler) {
		return addDomHandler(handler, DoubleClickEvent.getType());
	}

	@Override
	public HandlerRegistration addKeyPressHandler(KeyPressHandler arg0) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
}
