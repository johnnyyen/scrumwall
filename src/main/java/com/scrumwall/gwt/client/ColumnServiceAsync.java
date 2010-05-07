package com.scrumwall.gwt.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.scrumwall.gwt.client.ui.Column;

public interface ColumnServiceAsync {

	void getColumns(Integer sprintId, AsyncCallback<List<Column>> callback);
	
}
