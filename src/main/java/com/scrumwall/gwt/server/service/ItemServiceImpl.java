package com.scrumwall.gwt.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.scrumwall.gwt.RpcFacade;
import com.scrumwall.gwt.client.ItemService;
import com.scrumwall.gwt.server.dao.ItemDao;
import com.scrumwall.gwt.shared.ItemDTO;

@RpcFacade
public class ItemServiceImpl implements ItemService{

	@Autowired
	private ItemDao itemDao;

	public List<ItemDTO> getForColumn(int columnId) {
		return itemDao.getForColumn(columnId);
	}
	
	public void save(ItemDTO item) {
		itemDao.save(item);
	}
	
}
