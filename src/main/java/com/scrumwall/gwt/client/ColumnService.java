package com.scrumwall.gwt.client;

import java.util.List;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;
import com.scrumwall.gwt.shared.ColumnDTO;

@RemoteServiceRelativePath("service/columnService")
public interface ColumnService extends RemoteService {

	List<ColumnDTO> getColumns(Integer sprintId);
	
}
