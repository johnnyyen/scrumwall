package com.scrumwall.dao.item

import com.scrumwall.domain.Item
import com.scrumwall.domain.Column
import com.scrumwall.dao.BaseDao
import com.scrumwall.identifiers.ItemRemoveMode
import java.util.List

trait ItemDao extends BaseDao {
	def get(itemId: Int) : Item
 
	/**
	* Based on whether the item has id or not, either saves or updates it.	 
	*/
	def save(item: Item) : Item
 
	def getItems(columnId: Int) : List[Item]
 
	def getForSprint(sprintId: Int) : List[Item]
 
	def remove(id: Int)
 
	/**
	* @see ItemService.moveFromColumn()
	*/
	def moveFromColumn(column: Column, direction: ItemRemoveMode)
 
	def removeFromColumn(columnId: Int)
}
