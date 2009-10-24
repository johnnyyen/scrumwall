package com.scrumwall.service.item

import com.scrumwall.domain.Item
import com.scrumwall.domain.Column
import com.scrumwall.util.debug.LogsToLog4J
import com.scrumwall.dao.item.ItemDao
import com.scrumwall.identifiers.ItemRemoveMode
import java.util.List

class ItemServiceImpl extends ItemService {
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
    debug("Getting items for sprint " + sprintId)
    itemDao getForSprint sprintId
  }
  
  def remove(id: Int) = {
    itemDao remove id
  }
  
  def moveFromColumn(column:Column, direction: ItemRemoveMode) = {
    debug("Moving items from column " + column.id + " to the " + direction.direction)
    itemDao.moveFromColumn(column, direction)
  }
  
  def removeFromColumn(columnId: Int) = {
    debug("Removing items from column: " + columnId)
    itemDao.removeFromColumn(columnId)
  }
  
}
