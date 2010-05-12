package com.scrumwall.gwt.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.scrumwall.gwt.RpcFacade;
import com.scrumwall.gwt.client.ColumnService;
import com.scrumwall.gwt.server.dao.ColumnDao;
import com.scrumwall.gwt.shared.ColumnDTO;

@RpcFacade
public class ColumnServiceImpl implements ColumnService {

	@Autowired
	private ColumnDao columnDao;
	
	public List<ColumnDTO> getColumns(Integer sprintId){
		return columnDao.getColumns(sprintId);
	}
	
}
