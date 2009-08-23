package com.scrumwall.dao.item

import scala.runtime.RichInt
import com.scrumwall.domain.Item
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import java.util.HashMap
import java.util.List
import java.lang.Integer

class ItemDaoImpl extends ItemDao {
  
  override def get(itemId: Int) : Item = {
    debug( "Getting item with id: " + itemId )
    
    var map = new HashMap[String, Object]
    map.put( "id", new RichInt(itemId) )
    
    getNamedParameterJdbcTemplate.queryForObject(ItemDaoImpl.SQL_GET, map, ItemDaoImpl.mapper).asInstanceOf[Item]
  }
  
  override def save(item: Item) : Item = {
    return if(item.id == null) {
      saveItem(item)
    } else {
      update(item)
    }
  }
  
  override def getForSprint(sprintId: Int) : List[Item] = {
    
    
    var map = new HashMap[String, Object]
    map.put( "sprintId", new RichInt(sprintId) )
    
    getNamedParameterJdbcTemplate.query[Item](ItemDaoImpl.SQL_GET_SPRINT, map, ItemDaoImpl.mapper)
    
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
    map.put("col", item.column)
    map.put("color", item.color)
    map.put("width", item.width)
    map.put("height", item.height)
    map.put("hoursleft", item.hoursLeft)
    
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
    map.put("col", item.column)
    map.put("color", item.color)
    map.put("width", item.width)
    map.put("height", item.height)
    map.put("hoursleft", item.hoursLeft)
    
    getNamedParameterJdbcTemplate.update(ItemDaoImpl.SQL_UPDATE, map)
    
    item
  }
  
  def remove(id: Int) = {
    debug("Removing item with id: " + id)
    var map = new HashMap[String, Object]
    map.put("id", new RichInt(id))
    getNamedParameterJdbcTemplate.update(ItemDaoImpl.SQL_REMOVE, map)
  }

  def getItems(columnId: Int) : List[Item] = {
    var map = new HashMap[String, Object]
    map.put("column", new RichInt(columnId))
    getNamedParameterJdbcTemplate.query[Item](ItemDaoImpl.SQL_GET_ITEMS, map, ItemDaoImpl.mapper)
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
  val COLOR = "color"
  val HOURSLEFT = "hoursleft"
  val WIDTH = "width"
  val HEIGHT = "height"
  
  val SQL_GET = "SELECT id, content, estimation, offsetY, offsetX, owner, sprintid, col, color, hoursleft, height, width FROM item WHERE id = :id"  
  val SQL_SAVE = "INSERT INTO item(content, estimation, offsetX, offsetY, owner, sprintId, col, color, hoursleft, height, width) VALUES(:content, :estimation, :offsetX, :offsetY, :owner, :sprintId, :col, :color, :hoursleft, :height, :width)"  
  val SQL_UPDATE = "UPDATE item SET content = :content, estimation = :estimation, offsetY = :offsetY, offsetX = :offsetX, owner = :owner, sprintId = :sprintId, col = :col, color = :color, hoursleft = :hoursleft, height = :height, width = :width WHERE id = :id"  
  val SQL_GET_SPRINT = """SELECT 
  							id, content, estimation, sprintId, owner, col, offsetX, offsetY, color, hoursleft, height, width
  						FROM item WHERE sprintId = :sprintId AND col >= 0"""
  val SQL_REMOVE = "DELETE FROM item WHERE id = :id"
  val SQL_GET_ITEMS = "SELECT id, content, estimation, offsetY, offsetX, owner, sprintid, col, color, hoursleft, height, width FROM item WHERE col = :column"
  
  val mapper = new ParameterizedRowMapper[Item]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Item = {
	    var estimation: RichInt = null
	    if((rs getBigDecimal ESTIMATION) != null) {
	      estimation = new RichInt((rs getBigDecimal ESTIMATION).intValue)
	    }
		var item = new Item( new RichInt(rs getInt ID), rs getString CONTENT, estimation)
		
		var sprintId = rs getInt SPRINTID
		item setSprintId sprintId
		
		var owner = rs getString OWNER
		item setOwner owner
  
		var column = rs getInt COLUMN
		item setColumn column
		
		var offsetX = rs getDouble OFFSETX
		item setOffsetX offsetX
		
		var offsetY = rs getDouble OFFSETY
		item setOffsetY offsetY
  
		var color = rs getString COLOR
		item setColor color
		
		var hoursLeft: Integer = null
	    if((rs getBigDecimal HOURSLEFT) != null) {
	      hoursLeft = new Integer((rs getBigDecimal HOURSLEFT).intValue)
	    }
		item setHoursLeft hoursLeft
  
		var width = rs getInt WIDTH 
		item setWidth width
  
		var height = rs getInt HEIGHT
		item setHeight height
  
		item
      }
    }
}
