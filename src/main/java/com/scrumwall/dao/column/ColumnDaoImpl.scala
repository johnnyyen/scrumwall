package com.scrumwall.dao.column

import com.scrumwall.domain.Column
import scala.runtime.RichInt
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import java.util.HashMap
import java.util.List

class ColumnDaoImpl extends ColumnDao {

  override def getColumns: List[Column] = {
       
    getNamedParameterJdbcTemplate.query[Column]( 
      ColumnDaoImpl.SQL_GET_COLUMNS, new HashMap[String, Object], ColumnDaoImpl.mapper)
  }
  
  override def save(column: Column): Column = {
    if( column.id != null ){
      this update column
    }else{
      this saveColumn column
    }
  }
  
  private def saveColumn(column: Column): Column = {
    var parameters = ColumnDaoImpl getParameterMap column
	parameters.put( "columntype", "REGULAR" )
 
	getNamedParameterJdbcTemplate.update( ColumnDaoImpl.SQL_SAVE, parameters )
	column.setId( getLastInsertedId() )
    column
  }
  
  private def update(column: Column): Column = {
    getNamedParameterJdbcTemplate.update( ColumnDaoImpl.SQL_UPDATE, ColumnDaoImpl getParameterMap column )
    
    column
  }
  
}

object ColumnDaoImpl {
  val ID = "ID"
  val COLUMN_TYPE = "columntype"
  val NAME = "name"
  val WIDTH = "width"
  val ORDER = "columnorder"
  
  val SQL_GET_COLUMNS = "SELECT id, columntype, name, columnorder, width FROM col WHERE id >= 0 ORDER BY columnorder"
  val SQL_UPDATE = "UPDATE col set name=:name, width=:width, order=:order WHERE id=:id"
  val SQL_SAVE = "INSERT INTO col (name,width,columnorder, columntype) values (:name, :width, :columnorder, :columntype)"

  def getParameterMap(column: Column) : HashMap[String, Object] = {
    var map = new HashMap[String, Object]
    map.put( "name", column.name )
    map.put( "width", column.width )
    map.put( "order", column.order )
    map
  }
  
  val mapper = new ParameterizedRowMapper[Column]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Column = {
		var column = new Column( new RichInt(rs getInt ColumnDaoImpl.ID), rs getString ColumnDaoImpl.NAME, 
                           rs getString ColumnDaoImpl.COLUMN_TYPE)
		column.width = rs getDouble WIDTH
		column.order = rs getInt ORDER
		column
      }
    }
     
}
