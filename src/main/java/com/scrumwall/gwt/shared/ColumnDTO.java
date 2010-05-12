package com.scrumwall.gwt.shared;

import java.io.Serializable;

public class ColumnDTO implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private int id;
	private String name;
	private String type;
	private int sprintId;
	
	public int getId() {
		return id;
	}
	public ColumnDTO setId(int id) {
		this.id = id;
		return this;
	}
	public String getName() {
		return name;
	}
	public ColumnDTO setName(String name) {
		this.name = name;
		return this;
	}
	public String getType() {
		return type;
	}
	public ColumnDTO setType(String type) {
		this.type = type;
		return this;
	}
	public int getSprintId() {
		return sprintId;
	}
	public ColumnDTO setSprintId(int sprintId) {
		this.sprintId = sprintId;
		return this;
	}
	
	
}
