package com.scrumwall.gwt.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.scrumwall.gwt.shared.ColumnDTO;

public interface ColumnServiceAsync {

	void getColumns(Integer sprintId, AsyncCallback<List<ColumnDTO>> callback);
	
}
