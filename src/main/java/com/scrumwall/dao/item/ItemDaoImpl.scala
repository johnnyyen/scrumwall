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
		var item : Item = new Item( new RichInt(rs getInt ItemDaoImpl.ID), rs getString ItemDaoImpl.CONTENT, new RichInt(rs getInt ItemDaoImpl.ESTIMATION))
		var owner : String = rs getString ItemDaoImpl.OWNER
		item setOwner owner
		var sprintId = rs getBigDecimal ItemDaoImpl.SPRINTID
		if(sprintId != null) {
			item setSprintId sprintId.intValue
		}
  
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
		var item = new Item( new RichInt(rs getInt ItemDaoImpl.ID), rs getString ItemDaoImpl.CONTENT, new RichInt(rs getInt ItemDaoImpl.ESTIMATION))
		
		var sprintId = rs getInt ItemDaoImpl.SPRINTID
		item setSprintId sprintId
		
		var owner = rs getString ItemDaoImpl.OWNER
		item setOwner owner
  
		var column = rs getInt ItemDaoImpl.COLUMN
		item setColumn column
		
		var offsetX = rs getDouble ItemDaoImpl.OFFSETX
		item setOffsetX offsetX
		
		var offsetY = rs getDouble ItemDaoImpl.OFFSETY
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
    map.put("offsetX", item.offsetX)
    map.put("offsetY", item.offsetY)
    map.put("owner", item.owner)
    map.put("sprintId", item.sprintId)
    
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
    map.put("offsetX", item.offsetX)
    map.put("offsetY", item.offsetY)
    map.put("owner", item.owner)
    map.put("sprintId", item.sprintId)
    
    getNamedParameterJdbcTemplate.update(ItemDaoImpl.SQL_UPDATE, map)
    
    item
  }
  
}

object ItemDaoImpl {
  val SPRINTID = "sprintid"
  val OFFSETX = "offsetx"
  val OFFSETY = "offsety"
  val ESTIMATION = "estimation"
  val ID = "id"
  val OWNER = "owner"
  val CONTENT = "content" 
  val COLUMN = "col"
  
  val SQL_GET = "SELECT id, content, estimation, offsetY, offsetX, owner, sprintid FROM item WHERE id = :id"  
  val SQL_SAVE = "INSERT INTO item(content, estimation, offsetX, offsetY, owner, sprintId) VALUES(:content, :estimation, :offsetX, :offsetY, :owner, :sprintId)"  
  val SQL_UPDATE = "UPDATE item SET content = :content, estimation = :estimation, offsetY = :offsetY, offsetX = :offsetX, owner = :owner, sprintId = :sprintId WHERE id = :id"  
  val SQL_GET_SPRINT = "SELECT id, content, estimation, sprintId, owner, col, offsetX, offsetY from item where sprintId = :sprintId"
}
