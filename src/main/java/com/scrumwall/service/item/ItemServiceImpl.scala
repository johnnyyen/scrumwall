package com.scrumwall.service.item

import com.scrumwall.domain.item.Item
import com.scrumwall.util.debug.LogsToLog4J
import com.scrumwall.dao.item.ItemDao
import java.util.List

class ItemServiceImpl extends ItemService with LogsToLog4J {
  var itemDao: ItemDao = _
  def setItemDao(itemDao:ItemDao){
    this.itemDao = itemDao
  }
  def save(item: Item) : Item = {    
    itemDao save item
  }
  
  def get(id: Int) : Item = {
    debug( "Getting item with id: " + id )
    itemDao get id
  }
  
  def getForSprint(sprintId: Int) : List[Item] = {
    debug("fetching items for sprint " + sprintId)
    itemDao getForSprint sprintId
  }
}
