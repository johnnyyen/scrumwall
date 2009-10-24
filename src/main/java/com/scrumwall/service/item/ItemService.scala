package com.scrumwall.service.item

import com.scrumwall.domain.Item
import com.scrumwall.domain.Column
import com.scrumwall.identifiers.ItemRemoveMode
import java.util.List

trait ItemService extends BaseService{
	
  def get(id: Int) : Item
  
  def save(item: Item) : Item
  
  def getForSprint(sprintId: Int) : List[Item]
  
  def getItems(columnId: Int) : List[Item]

  def remove(id: Int)

  /**
  * Moves items from specified column and sprint to the column on either the 
  * left or the right depending on direction parameter.
  * 
  * @see com.scrumwall.identifiers.ItemRemoveMode
  */
  def moveFromColumn(column: Column, direction: ItemRemoveMode)
  
  def removeFromColumn(columnId: Int)
  
}
