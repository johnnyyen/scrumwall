package com.scrumwall.gwt.client.ui;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.allen_sauer.gwt.dnd.client.PickupDragController;
import com.allen_sauer.gwt.dnd.client.drop.DropController;
import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiConstructor;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DeckPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.ProvidesResize;
import com.google.gwt.user.client.ui.RequiresResize;
import com.google.gwt.user.client.ui.Widget;
import com.scrumwall.gwt.client.ItemService;
import com.scrumwall.gwt.client.ItemServiceAsync;
import com.scrumwall.gwt.shared.ColumnDTO;
import com.scrumwall.gwt.shared.ItemDTO;

public class Column extends Composite implements ProvidesResize, RequiresResize{

	private final ItemServiceAsync itemService = GWT.create(ItemService.class);
	private static ColumnUiBinder binder;

	@UiField
	protected DeckPanel columnNameArea;

	@UiField
	protected Label columnName;

	@UiField
	protected AbsolutePanel columnBody;

	private ColumnDTO dto;
	private Map<Integer,Item> items;
	
	public String getName() {
		return dto.getName();
	}

	interface ColumnStyle extends CssResource{
		String highlight();
	}
	@UiField
	ColumnStyle style;
	
	@UiTemplate("Column.ui.xml")
	interface ColumnUiBinder extends UiBinder<Widget, Column> {
	}

	@UiConstructor
	public Column(ColumnDTO column, final PickupDragController dragController) {
		this.dto = column;
		
		items = new HashMap<Integer,Item>();
		final Column instance = this;
		
		itemService.getForColumn(dto.getId(),
				new AsyncCallback<List<ItemDTO>>() {
					@Override
					public void onFailure(Throwable e) {
					}

					@Override
					public void onSuccess(List<ItemDTO> itemDTOs) {
						for (ItemDTO itemDTO : itemDTOs) {
							Item item = new Item(itemDTO, instance, dragController);
							items.put(item.getId(), item);
							columnBody.add(item);
						}
					}
				});
		binder = GWT.create(ColumnUiBinder.class);
		initWidget(binder.createAndBindUi(this));
		columnName.setText(dto.getName());
		columnNameArea.showWidget(0);
		this.setWidth(dto.getWidth() + "%");
		
		DropController droppable = new ColumnDropController(this);
		dragController.registerDropController(droppable);

	}

	public int getId() {
		return dto.getId();
	}

	public void onResize() {
		throw new UnsupportedOperationException("can't resize");
	}
	
	public void onDrop(Widget widget){
		Item item = (Item)widget;
		if(items.get(item.getId()) == null){
			item.replaceColumn(this);
			items.put(item.getId(), item);
			
		}
		
		widget.setVisible(true);
		item.save();
	}
	
	public void removeItem(Item item){
		if(item == null){
			throw new IllegalArgumentException("item is null");
		}
		if(items.get(item.getId()) == null){
			items.remove(item.getId());
		}
	}
	
	public void highlight(){
		this.addStyleName(style.highlight());
	}
	
	public void unHighlight(){
		this.removeStyleName(style.highlight());
	}
	
	public AbsolutePanel getBody(){
		return columnBody;
	}
	
	public int getLeft(){
		return columnBody.getAbsoluteLeft();
	}
	
	public int getTop(){
		return columnBody.getAbsoluteTop();
	}
}
