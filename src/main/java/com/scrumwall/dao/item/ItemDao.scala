package com.scrumwall.dao.item

import com.scrumwall.domain.Item
import com.scrumwall.dao.BaseDao
import java.util.List

trait ItemDao extends BaseDao {
	def get(itemId: Int) : Item
 
	/**
	* Based on whether the item has id or not, either saves or updates it.	 
	*/
	def save(item: Item) : Item
 
	/**
	* Returns all of the items for a column 
	*/
	def getItems(columnId: Int) : List[Item]
 
	/**
	* Fetches all items that belong to specified sprint
	* 
	*/
	def getForSprint(sprintId: Int) : List[Item]
 
	/**
	* Removes the item from the database 
	*/
	def remove(id: Int)
}
