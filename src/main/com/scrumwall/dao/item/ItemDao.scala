package com.scrumwall.dao.item

import com.scrumwall.domain.item.Item
import org.springframework.jdbc.core.simple.SimpleJdbcDaoSupport

trait ItemDao extends SimpleJdbcDaoSupport {
	def getItem(itemId: Int) : Item
}
