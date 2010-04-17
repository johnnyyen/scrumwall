package com.scrumwall.gwt.server;

import java.util.List;

import com.scrumwall.domain.Item;
import com.scrumwall.gwt.BaseRemoteService;
import com.scrumwall.gwt.client.GreetingService;
import com.scrumwall.gwt.shared.FieldVerifier;
import com.scrumwall.service.item.ItemService;

/**
 * The server side implementation of the RPC service.
 */
public class GreetingServiceImpl extends BaseRemoteService implements GreetingService {
	
	private static final long serialVersionUID = 1L;
	
	private ItemService itemService;
	
	public void setItemService(ItemService itemService) {
		this.itemService = itemService;
	}

	public String greetServer(String input) throws IllegalArgumentException {
		// Verify that the input is valid. 
		if (!FieldVerifier.isValidName(input)) {
			// If the input is not valid, throw an IllegalArgumentException back to
			// the client.
			throw new IllegalArgumentException(
					"Name must be at least 4 characters long");
		}

		String serverInfo = getServletContext().getServerInfo();
		String userAgent = getThreadLocalRequest().getHeader("User-Agent");
		
		List<Item> items = itemService.getItems(0);
		
		return  items.get(0).getContent() + "Hello, " + input + "!<br><br>I am running " + serverInfo
				+ ".<br><br>It looks like you are using:<br>" + userAgent;
	}
}
