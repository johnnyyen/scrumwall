package com.scrumwall.gwt;

import com.google.gwt.inject.client.Ginjector;
import com.scrumwall.gwt.client.ColumnService;

public interface GinInjector extends Ginjector {

	ColumnService getColumnService();
	
}
