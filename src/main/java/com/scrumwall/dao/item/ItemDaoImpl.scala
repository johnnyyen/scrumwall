package com.scrumwall.dao.item

import scala.runtime.RichInt
import com.scrumwall.domain.Item
import com.scrumwall.domain.Column
import com.scrumwall.identifiers.ItemRemoveMode
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import java.util.HashMap
import java.util.List
import java.lang.Integer

class ItemDaoImpl extends ItemDao {
  
  override def get(itemId: Int) : Item = {    
    var map = new HashMap[String, Object]
    map.put( "id", new RichInt(itemId) )
    getNamedParameterJdbcTemplate.queryForObject( ItemDaoImpl.SQL_GET, map, ItemDaoImpl.mapper ).
      asInstanceOf[Item]
  }
  
  override def save(item: Item) : Item = {
    return if( item.id == null ) {
      saveItem( item )
    } else {
      update( item )
    }
  }
  
  override def getForSprint(sprintId: Int) : List[Item] = {
    var map = new HashMap[String, Object]
    map.put( "sprintId", new RichInt(sprintId) )    
    getNamedParameterJdbcTemplate.query[Item]( ItemDaoImpl.SQL_GET_SPRINT, map, ItemDaoImpl.mapper )
    
  }
  
  override def remove(id: Int) = {
    var map = new HashMap[String, Object]
    map.put( "id", new RichInt(id) )
    getNamedParameterJdbcTemplate.update( ItemDaoImpl.SQL_REMOVE, map )
  }

  override def getItems(columnId: Int) : List[Item] = {
    var map = new HashMap[String, Object]
    map.put( "column", new RichInt(columnId) )
    getNamedParameterJdbcTemplate.query[Item]( ItemDaoImpl.SQL_GET_ITEMS, map, ItemDaoImpl.mapper )
  }

  override def moveFromColumn(column:Column, direction: ItemRemoveMode) = {
    
  }
 
  override def removeFromColumn(columnId: Int) = {
    
  }
  
  private def saveItem(item: Item) : Item = {
    getNamedParameterJdbcTemplate.update( ItemDaoImpl.SQL_SAVE, ItemDaoImpl getParameterMap item )
    item.setId( getLastInsertedId() )
    item
  }
  
  private def update(item: Item) : Item = {
    getNamedParameterJdbcTemplate.update( ItemDaoImpl.SQL_UPDATE, ItemDaoImpl getParameterMap item )
    
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
  
  def getParameterMap(item: Item): HashMap[String, Object] = {
	val parameterMap = new HashMap[String, Object]
    parameterMap.put( "content", item.content )
    parameterMap.put( "estimation",item.estimation )
    parameterMap.put( "id", item.id )
    parameterMap.put( "offsetX", item.offsetX )
    parameterMap.put( "offsetY", item.offsetY )
    parameterMap.put( "owner", item.owner )
    parameterMap.put( "sprintId", item.sprintId )
    parameterMap.put( "col", item.column )
    parameterMap.put( "color", item.color )
    parameterMap.put( "width", item.width )
    parameterMap.put( "height", item.height )
    parameterMap.put( "hoursleft", item.hoursLeft )
    parameterMap
  }
  
  val mapper = new ParameterizedRowMapper[Item]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Item = {
	    var estimation: RichInt = null
	    if((rs getBigDecimal ESTIMATION) != null) {
	      estimation = new RichInt((rs getBigDecimal ESTIMATION).intValue)
	    }
		var item = new Item( new RichInt(rs getInt ID), rs getString CONTENT, estimation )
		
		var sprintId = rs getBigDecimal SPRINTID
		if(sprintId != null) {
			item setSprintId sprintId.intValue
		}
		
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
