package com.scrumwall.dao.column

import com.scrumwall.domain.Column
import scala.runtime.RichInt
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import java.util.HashMap
import java.util.List

class ColumnDaoImpl extends ColumnDao {

  override def getColumns : List[Column] = {
       
    getNamedParameterJdbcTemplate.query[Column](ColumnDaoImpl.SQL_GET_COLUMNS, new HashMap[String, Object], ColumnDaoImpl.mapper)
  }
  
  override def save(column: Column) : Column = {
	var map = new HashMap[String, Object]
    map.put("name", column.name)
    map.put("width", column.width)
    map.put("order", column.order)
    if(column.id != null){
      getNamedParameterJdbcTemplate.update(ColumnDaoImpl.SQL_UPDATE, map)
    }else{
      map.put("columntype", "REGULAR")
      getNamedParameterJdbcTemplate.update(ColumnDaoImpl.SQL_SAVE, map)
      column.setId( getLastInsertedId() )
    }
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
  val mapper = new ParameterizedRowMapper[Column]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Column = {
		val column = new Column( new RichInt(rs getInt ColumnDaoImpl.ID), rs getString ColumnDaoImpl.NAME, rs getString ColumnDaoImpl.COLUMN_TYPE)
		column.width = rs getDouble WIDTH
		column.order = rs getInt ORDER
		column
      }
    }
     
}
