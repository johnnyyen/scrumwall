package com.scrumwall.gwt.shared;

import java.io.Serializable;

import com.scrumwall.gwt.client.ui.Column;

public class ItemDTO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private String content;
	private Integer estimation;
	private Double offsetX;
	private Double offsetY;
	private String owner;
	private int columnId;
	private String color;
	private Integer height;
	private Integer width;

	public ItemDTO setId(Integer id) {
		this.id=id;
		return this;
	}

	public ItemDTO setContent(String content) {
		this.content = content;
		return this;
	}

	public ItemDTO setEstimation(Integer estimation) {
		this.estimation = estimation;
		return this;
	}

	public ItemDTO setOffsetX(Double offsetX) {
		this.offsetX = offsetX;
		return this;
	}

	public ItemDTO setOffsetY(Double offsetY) {
		this.offsetY = offsetY;
		return this;
	}

	public ItemDTO setOwner(String owner) {
		this.owner = owner;
		return this;
	}

	public ItemDTO setColumnId(int columnId) {
		this.columnId = columnId;
		return this;
	}

	public ItemDTO setColor(String color) {
		this.color = color;
		return this;
	}

	public ItemDTO setHeight(Integer height) {
		this.height = height;
		return this;
	}

	public ItemDTO setWidth(Integer width) {
		this.width = width;
		return this;
	}

	public ItemDTO setLeft(int offsetLeft, Column column) {
		this.offsetX = Double.valueOf(offsetLeft / column.getElement().getClientWidth() * 100);
		return this;
	}
	
	public ItemDTO setTop(int offsetTop, Column column) {
		this.offsetY = Double.valueOf(offsetTop / column.getElement().getClientHeight() * 100);
		return this;
	}
	
	public Integer getId() {
		return id;
	}

	public String getContent() {
		return content;
	}

	public Integer getEstimation() {
		return estimation;
	}

	public String getEstimationString() {
		return estimation != null ? estimation.toString() : "";
	}
	
	public Double getOffsetX() {
		return offsetX;
	}

	public Double getOffsetY() {
		return offsetY;
	}

	public String getOwner() {
		return owner;
	}

	public int getColumnId() {
		return columnId;
	}

	public String getColor() {
		return color;
	}

	public Integer getHeight() {
		return height;
	}

	public Integer getWidth() {
		return width;
	}

	public String getLeft(Column column) {
		return (column.getElement().getClientWidth() * this.getOffsetX() / 100) + "px";
	}

	public String getTop(Column column) {
		return (column.getElement().getClientHeight() * this.getOffsetY() / 100) + "px";
	}

}
