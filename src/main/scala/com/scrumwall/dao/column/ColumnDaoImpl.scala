package com.scrumwall.dao.column

import com.scrumwall.domain.Column
import com.scrumwall.identifiers.ItemRemoveMode
import scala.runtime.RichInt
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import java.util.HashMap
import java.util.List

class ColumnDaoImpl extends ColumnDao {

  override def getColumns(sprintId: Int): List[Column] = {
    val map = new HashMap[String, Object];
    map.put("sprintId", new RichInt(sprintId))
    
    getNamedParameterJdbcTemplate.query[Column]( 
      ColumnDaoImpl.SQL_GET_COLUMNS, map, ColumnDaoImpl.mapper)
  }
  
  override def save(column: Column): Column = {
    if( column.id != null ){
      this update column
    }else{
      this.saveColumn(column)
    }
  }
  
  override def remove(id: Int) = {
    val map = new HashMap[String, Object]
    map.put("id", new RichInt(id))
    getNamedParameterJdbcTemplate.update(ColumnDaoImpl.SQL_REMOVE, map)
  }
  
  private def saveColumn(column: Column): Column = {
    debug("Saving column: " + column)
    var map = ColumnDaoImpl getParameterMap column
	map.put( "columntype", Column.REGULAR )
	map.put( "sprintId", column.sprintId)
 
	getNamedParameterJdbcTemplate.update( ColumnDaoImpl.SQL_SAVE, map )
 
	val id = getLastInsertedId();
 
    debug("The last inserted id is: " + id)
 
	column.setId( id )
    column
  }
  
  private def update(column: Column): Column = {
    debug("Updating column: " + column)
    
    val map = ColumnDaoImpl getParameterMap column;
    map.put("id", column.id)
    
    getNamedParameterJdbcTemplate.update( ColumnDaoImpl.SQL_UPDATE, map )
    column
  }
  
}

object ColumnDaoImpl {
  val ID = "ID"
  val COLUMN_TYPE = "columntype"
  val NAME = "name"
  val WIDTH = "width"
  val ORDER = "columnorder"
  val SPRINT = "sprintId"
  
  val SQL_GET_COLUMNS = 
    """SELECT id, columntype, name, columnorder, width, sprintId 
  	FROM col 
  	WHERE id >= 0 AND sprintId = :sprintId  
  	ORDER BY columnorder """
  val SQL_UPDATE = "UPDATE col set name=:name, width=:width, columnorder=:columnorder WHERE id=:id"
  val SQL_SAVE = 
    """INSERT INTO col (name,width,columnorder, columntype, sprintId) 
  	VALUES (:name, :width, :columnorder, :columntype, :sprintId)"""
  val SQL_REMOVE = "DELETE FROM col WHERE id = :id"

  def getParameterMap(column: Column) : HashMap[String, Object] = {
    var map = new HashMap[String, Object]
    map.put( "name", column.name )
    map.put( "width", column.width )
    map.put( "columnorder", column.order )
    map.put( "columntype", column.columnType )
    map
  }
  
  val mapper = new ParameterizedRowMapper[Column]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Column = {
		var column = new Column( new RichInt(rs getInt ID), rs getString NAME, 
                           rs getString COLUMN_TYPE)
		column.width = rs getDouble WIDTH
		column.order = rs getInt ORDER
		column.sprintId = rs getInt SPRINT
		column
      }
    }
     
}
