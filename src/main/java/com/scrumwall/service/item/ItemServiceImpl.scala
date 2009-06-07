package com.scrumwall.service.item

import com.scrumwall.domain.item.Item
import com.scrumwall.util.debug.LogsToLog4J
import com.scrumwall.dao.item.ItemDao

class ItemServiceImpl(val itemDao: ItemDao) extends ItemService with LogsToLog4J {
	
  def save(item: Item) : Item = {    
    itemDao save item
  }
  
  def get(id: Int) : Item = {
    debug( "Getting item with id: " + id )
    itemDao get id
  }
  
}
