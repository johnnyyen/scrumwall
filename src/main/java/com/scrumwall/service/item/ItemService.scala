package com.scrumwall.service.item

import com.scrumwall.domain.item.Item

trait ItemService {
	
  def saveItem(item: Item)
  
}
