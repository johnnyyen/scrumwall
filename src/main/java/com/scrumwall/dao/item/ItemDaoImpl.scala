package com.scrumwall.dao.item

import com.scrumwall.domain.item.Item
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import scala.runtime.RichInt
import java.util.HashMap
import java.util.List

class ItemDaoImpl extends ItemDao {
  
  override def get(itemId: Int) : Item = {
    debug( "Getting item with id: " + itemId )
    
    val mapper = new ParameterizedRowMapper[Item]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Item = {
		var item : Item = new Item( new RichInt(rs getInt "id"), rs getString "content", new RichInt(rs getInt "estimation"))
		var owner : String = rs getString "owner"
		item setOwner owner
		var sprintId = rs getInt "sprint_id"
		item setSprintId sprintId
  
		item
      }
    }
    
    var map = new HashMap[String, Object]
    map.put( "id", new RichInt(itemId) )
    
    getNamedParameterJdbcTemplate.queryForObject(ItemDaoImpl.SQL_GET, map, mapper).asInstanceOf[Item]
  }
  
  override def save(item: Item) : Item = {
    return if(item.id == null) {
      saveItem(item)
    } else {
      update(item)
    }
  }
  
  override def getForSprint(sprintId: Int) : List[Item] = {
    val mapper = new ParameterizedRowMapper[Item]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Item = {
		var item = new Item( new RichInt(rs getInt "id"), rs getString "content", new RichInt(rs getInt "estimation"))
		
		var sprintId = rs getInt "sprint_id"
		item setSprintId sprintId
		
		var owner : String = rs getString "owner"
		item setOwner owner
  
		var column : Int = rs getInt "col"
		item setColumn column
		
		var offsetX : Int = rs getInt "offset_x"
		item setOffsetX offsetX
		
		var offsetY : Int = rs getInt "offset_y"
		item setOffsetY offsetY
		
		item
      }
    }
    
    var map = new HashMap[String, Object]
    map.put( "sprintId", new RichInt(sprintId) )
    
    getNamedParameterJdbcTemplate.query[Item](ItemDaoImpl.SQL_GET_SPRINT, map, mapper)
    
  }
  private def saveItem(item: Item) : Item = {
    debug("Saveing item : " + item)
    var map = new HashMap[String, Object]
    map.put("content", item.content)
    map.put("estimation", item.estimation)
    getNamedParameterJdbcTemplate.update(ItemDaoImpl.SQL_SAVE, map)
    item.setId( getLastInsertedId() )
    item
  }
  
  private def update(item: Item) : Item = {
    debug("Updating item : " + item)
    
    var map = new HashMap[String, Object]
    map.put("content", item.content)
    map.put("estimation",item.estimation)
    map.put("id", item.id)
    
    getNamedParameterJdbcTemplate.update(ItemDaoImpl.SQL_UPDATE, map)
    
    item
  }
  
}

object ItemDaoImpl {
  val SQL_GET = "SELECT id, content, estimation, sprint_id, owner FROM item WHERE id = :id"
  
  val SQL_SAVE = "INSERT INTO item(content, estimation) VALUES(:content, :estimation)"
  
  val SQL_UPDATE = "UPDATE item SET content = :content, estimation = :estimation  WHERE id = :id"
  
  val SQL_GET_SPRINT = "SELECT id, content, estimation, sprint_id, owner, col, offset_x, offset_y from item where sprint_id = :sprintId"
}
