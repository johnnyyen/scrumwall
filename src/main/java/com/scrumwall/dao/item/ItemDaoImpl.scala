package com.scrumwall.dao.item

import com.scrumwall.domain.item.Item
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import scala.runtime.RichInt

class ItemDaoImpl extends ItemDao {
  
  override def get(itemId: Int) : Item = {
    debug( "Getting item with id: " + itemId )
    
    val mapper = new ParameterizedRowMapper[Item]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Item = {
		new Item( (rs getInt "id").intValue, rs getString "content", (rs getInt "estimation").intValue)
      }
    }
    
    getSimpleJdbcTemplate.queryForObject(ItemDaoImpl.SQL_GET, mapper, new RichInt(itemId)).asInstanceOf[Item]
  }
  
  override def save(item: Item) : Item = {
    return if(item.id == null) {
      saveItem(item)
    } else {
      update(item)
    }
  }
  
  private def saveItem(item: Item) : Item = {
    debug("Saveing item : " + item)
    getSimpleJdbcTemplate.update(ItemDaoImpl.SQL_SAVE, Map("content" -> item.content, "estimation" -> item.estimation))
    item.setId( getLastInsertedId() )
    item
  }
  
  private def update(item: Item) : Item = {
    debug("Updating item : " + item)
    getSimpleJdbcTemplate.update(ItemDaoImpl.SQL_UPDATE, Map("content" -> item.content, "estimation" -> item.estimation, "id" -> item.id))
    item
  }
  
}

object ItemDaoImpl {
  val SQL_GET = "SELECT id, content, estimation FROM item WHERE id = :id"
  
  val SQL_SAVE = "INSERT INTO item(content, estimation) VALUES(:content, :estimation)"
  
  val SQL_UPDATE = "UPDATE item SET content = :content, estimation = :estimation  WHERE id = :id"
}
