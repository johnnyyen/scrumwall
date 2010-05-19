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
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.DeckPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.scrumwall.gwt.client.ItemService;
import com.scrumwall.gwt.client.ItemServiceAsync;
import com.scrumwall.gwt.shared.ItemDTO;

public class Item extends CompositeDraggable implements HasDoubleClickHandlers, DoubleClickHandler, HasKeyPressHandlers, KeyPressHandler{

	private final ItemServiceAsync itemService = GWT.create(ItemService.class);
	
	@UiField protected DeckPanel contentArea; 
	@UiField protected TextArea content;
	@UiField protected InlineLabel contentText;
	@UiField protected TextBox ownerName;
	@UiField protected TextBox estimation;
	
	@UiTemplate("Item.ui.xml")
	interface Binder extends UiBinder<Widget, Item>{};
	private static final Binder binder = GWT.create(Binder.class);
	private PickupDragController dragController;
	
	private ItemDTO dto;
	private Column column;
	
	public Item(ItemDTO item, Column column) {
		this.dto = item;
		this.column = column;
		
		initWidget(binder.createAndBindUi(this));
		contentArea.showWidget(0);
		dragController = new PickupDragController(RootPanel.get(), true);
		
		//initiate dragging only when mouse has been dragged for at least 1 px
		//This allows registering custom onClick events
		dragController.setBehaviorDragStartSensitivity(1);
		
		dragController.makeDraggable(this);
		this.addDoubleClickHandler(this);
		content.addKeyPressHandler(this);
		
		this.contentText.setText(dto.getContent());
		this.ownerName.setText(dto.getOwner());
		this.estimation.setText(dto.getEstimationString());
		
		this.setPixelSize(dto.getWidth(), dto.getHeight());
		DOM.setStyleAttribute(getElement(), "left", dto.getLeft(column));
		DOM.setStyleAttribute(getElement(), "top", dto.getTop(column));
		DOM.setStyleAttribute(getElement(), "backgroundColor", dto.getColor());
		
	}

	public void save() {
		this.dto = new ItemDTO().setId(dto != null ? dto.getId() : null)
						.setContent(this.contentText.getText())
						.setEstimation(this.estimation.getText().trim() != "" ? 
											new Integer(this.estimation.getText().trim()) : 
											null)
						.setLeft(getElement().getOffsetLeft(), column)
						.setTop(getElement().getOffsetTop(), column)
						.setOwner(this.ownerName.getText().trim() != "" ? 
									this.ownerName.getText().trim() : 
									null)
						.setColumnId(column.getId())
						.setColor(DOM.getStyleAttribute(getElement(), "backgroundColor"))
						.setHeight(getElement().getClientHeight())
						.setWidth(getElement().getClientWidth());
		itemService.save(this.dto, new AsyncCallback<Void>() {
			@Override public void onSuccess(Void arg0) {}
			@Override public void onFailure(Throwable arg0) {}
		});
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
			this.save();
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
