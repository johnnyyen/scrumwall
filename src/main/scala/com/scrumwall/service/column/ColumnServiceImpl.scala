package com.scrumwall.service.column

import com.scrumwall.util.debug.LogsToLog4J
import com.scrumwall.dao.column.ColumnDao
import com.scrumwall.domain.Column
import com.scrumwall.identifiers._
import com.scrumwall.service.item.ItemService
import java.util.List

class ColumnServiceImpl extends ColumnService {

  var itemService: ItemService = _
  def setItemService(itemService: ItemService){
    this.itemService = itemService
  }
  
  var columnDao: ColumnDao = _
  def setColumnDao(columnDao: ColumnDao){
    this.columnDao = columnDao
  }
  
  override def getColumns(sprintId: Int) : List[Column] = {
    debug("Getting all columns for sprint: " + sprintId)
    columnDao getColumns sprintId
  }
  
  override def save(column: Column): Column = {
    columnDao.save(column)
  }
  
  override def remove(column: Column, mode: Int) = {
	debug("Removing column: " + column + " with mode " + ItemRemoveMode(mode).direction)
 
    ItemRemoveMode(mode) match {
      case MOVE_LEFT => itemService.moveFromColumn(column, MOVE_LEFT)
      case MOVE_RIGHT => itemService.moveFromColumn(column, MOVE_RIGHT)
      case REMOVE => itemService.removeFromColumn(column.getId)
      case NO_ITEMS => debug("No items to alter because of the removed column") 
      case _ => throw new IllegalArgumentException("I don't know how to handle removemode: " + mode)
    }
    
    columnDao.remove(column.getId)
  }
  
}
