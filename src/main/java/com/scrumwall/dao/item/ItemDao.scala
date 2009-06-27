package com.scrumwall.dao.item

import com.scrumwall.domain.item.Item
import com.scrumwall.dao.BaseDao
import java.util.List

trait ItemDao extends BaseDao {
	def get(itemId: Int) : Item
 
	/**
	* Based on whether the item has id or not, either saves or updates it.	 
	*/
	def save(item: Item) : Item
 
	/**
	* Fetches all items that belong to specified sprint
	* 
	*/
	def getForSprint(sprintId: Int) : List[Item]
}
