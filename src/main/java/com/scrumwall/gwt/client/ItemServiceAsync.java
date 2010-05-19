package com.scrumwall.gwt.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.scrumwall.gwt.shared.ItemDTO;

public interface ItemServiceAsync {
	void getForColumn(int columnId, AsyncCallback<List<ItemDTO>> callback);
	void save(ItemDTO item, AsyncCallback<Void> callback);
}
