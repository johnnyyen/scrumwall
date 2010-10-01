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
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.DeckPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.scrumwall.gwt.client.ItemService;
import com.scrumwall.gwt.client.ItemServiceAsync;
import com.scrumwall.gwt.shared.ItemDTO;

public class Item extends CompositeDraggable implements HasDoubleClickHandlers, DoubleClickHandler, HasKeyPressHandlers, KeyPressHandler{

	private final ItemServiceAsync itemService = GWT.create(ItemService.class);
	private static final int VIEW_MODE = 0;
	private static final int EDIT_MODE = 1;
	
	private PickupDragController dragController;
	private ItemDTO dto;
	private Column column;
	
	
	@UiField protected DeckPanel contentArea; 
	@UiField protected TextArea content;
	@UiField protected InlineLabel contentText;
	@UiField protected TextBox ownerName;
	@UiField protected TextBox estimation;
	
	@UiTemplate("Item.ui.xml")
	interface Binder extends UiBinder<Widget, Item>{};
	private static final Binder binder = GWT.create(Binder.class);
	
	
	public Item(ItemDTO item, Column column, PickupDragController dragController) {
		this.dto = item;
		this.setColumn(column);
		this.dragController = dragController;
		
		initWidget(binder.createAndBindUi(this));
		contentArea.showWidget(VIEW_MODE);
		
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
		
		GWT.log("offset left " + getOffsetLeft());
		GWT.log("offset top " + getOffsetTop());
		this.dto = new ItemDTO().setId(dto != null ? dto.getId() : null)
						.setContent(this.contentText.getText())
						.setEstimation(this.estimation.getText().trim() != "" ? 
											new Integer(this.estimation.getText().trim()) : 
											null)
						.setLeft(this.getOffsetLeft(), column)
						.setTop(this.getOffsetTop(), column)
						.setOwner(this.ownerName.getText().trim() != "" ? 
									this.ownerName.getText().trim() : 
									null)
						.setColumnId(column.getId())
						.setColor(DOM.getStyleAttribute(getElement(), "backgroundColor"))
						.setHeight(getElement().getClientHeight())
						.setWidth(getElement().getClientWidth());
		
		GWT.log("left % " + dto.getOffsetX());
		GWT.log("top % " + dto.getOffsetY());
		
		itemService.save(this.dto, new AsyncCallback<Void>() {
			@Override 
			public void onSuccess(Void arg0) {GWT.log("save successful");}
			@Override 
			public void onFailure(Throwable arg0) {GWT.log("save failed " + arg0.getMessage());}
		});
	}
	
	@Override
	public void onDoubleClick(DoubleClickEvent event) {
		content.setText(contentText.getText());
		contentArea.showWidget(EDIT_MODE);
		content.setFocus(true);
		dragController.makeNotDraggable(this);
		
		
	}

	@Override
	public void onKeyPress(KeyPressEvent event) {
		
		if(event.getCharCode() == KeyCodes.KEY_ESCAPE){
			contentArea.showWidget(VIEW_MODE);
			dragController.makeDraggable(this);
		}else if(event.isControlKeyDown() && event.getCharCode() == KeyCodes.KEY_ENTER){
			contentText.setText(content.getText());
			contentArea.showWidget(VIEW_MODE);
			dragController.makeDraggable(this);
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
	
	public Integer getId(){
		return dto.getId();
	}
	
	public ItemDTO getDto(){
		return dto;
	}
	
	public void replaceColumn(Column column){
		this.column.removeItem(this);
		this.setColumn(column);
	}
	
	public void setColumn(Column column){
		this.column = column;
	}
	
	public void delete(){
		//TODO implement me
	}
	
	private int getOffsetLeft(){
		return getElement().getAbsoluteLeft() < column.getLeft() ? 0 : getElement().getAbsoluteLeft() - column.getLeft();
	}
	
	private int getOffsetTop(){
		return getElement().getAbsoluteTop() < column.getTop() ? 0 : getElement().getAbsoluteTop() - column.getTop();
	}
	
	public void disableEditing(){
		contentText.setText(content.getText());
		contentArea.showWidget(VIEW_MODE);
	}
}
