package com.scrumwall.dao.item

import com.scrumwall.domain.item.Item
import com.scrumwall.dao.BaseDao

trait ItemDao extends BaseDao {
	def getItem(itemId: Int) : Item
}
