package com.scrumwall.service.item

import com.scrumwall.domain.Item
import com.scrumwall.util.debug.LogsToLog4J
import com.scrumwall.dao.item.ItemDao
import java.util.List

class ItemServiceImpl extends ItemService with LogsToLog4J {
  var itemDao: ItemDao = _
  def setItemDao(itemDao:ItemDao){
    this.itemDao = itemDao
  }
  def save(item: Item) : Item = {
    debug( "Saveing item with id: " + item.id )
    itemDao save item
  }
  
  def get(id: Int) : Item = {
    debug( "Getting item with id: " + id )
    itemDao get id
  }

  def getItems(columnId: Int) : List[Item] = {
    debug( "Getting items for column: " + columnId )
    itemDao getItems columnId
  }
  
  def getForSprint(sprintId: Int) : List[Item] = {
    debug("fetching items for sprint " + sprintId)
    itemDao getForSprint sprintId
  }
  
  def remove(id: Int) = {
    itemDao remove id
  }
}
