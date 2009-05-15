package com.scrumwall.dao.item

import com.scrumwall.domain.item.Item
import com.scrumwall.domain.item.ItemImpl
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import scala.runtime.RichInt
import com.scrumwall.util.debug.LogsToLog4J

class ItemDaoImpl extends ItemDao{
  
  override def getItem(itemId: Int) : Item = {
    debug( "Getting item with id: " + itemId );
    
    debug(new Exception()) {
      "Something happened when trying to get choice with id: " + itemId
    }
    
    val mapper: ParameterizedRowMapper[Item] = new ParameterizedRowMapper[Item]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Item = {
			  val item: Item = new ItemImpl(rs.getInt("id"), rs.getString("content"), rs.getInt("estimation"))
            	item
      }
    };
    
    getSimpleJdbcTemplate.queryForObject(ItemDaoImpl.SQL_GET_ITEM, mapper, new RichInt(itemId)).asInstanceOf[Item]
  }
  
}

object ItemDaoImpl {
  val SQL_GET_ITEM = "SELECT id, content, estimation FROM item WHERE id = :id";
}
