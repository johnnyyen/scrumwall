package com.scrumwall.gwt.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.scrumwall.gwt.RpcFacade;
import com.scrumwall.gwt.client.ColumnService;
import com.scrumwall.gwt.client.ui.Column;
import com.scrumwall.gwt.server.dao.ColumnDao;

@RpcFacade
public class ColumnServiceImpl implements ColumnService {

	@Autowired
	private ColumnDao columnDao;
	
	public List<Column> getColumns(Integer sprintId){
		return columnDao.getColumns(sprintId);
	}
	
}
