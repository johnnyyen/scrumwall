package com.scrumwall.gwt.client;

import java.util.List;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;
import com.scrumwall.gwt.shared.ItemDTO;

@RemoteServiceRelativePath("service/itemService")
public interface ItemService extends RemoteService {
	List<ItemDTO> getForColumn(int columnId);
	void save(ItemDTO item);
}
