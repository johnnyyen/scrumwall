package com.scrumwall.gwt.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;
import com.scrumwall.gwt.client.ColumnService;
import com.scrumwall.gwt.client.ui.Column;
import com.scrumwall.gwt.server.dao.ColumnDao;

public class ColumnServiceImpl extends RemoteServiceServlet implements ColumnService {

	@Autowired
	private ColumnDao columnDao;
	
	public List<Column> getColumns(Integer sprintId){
		return columnDao.getColumns(sprintId);
	}
	
}
