package com.scrumwall.dao.column

import com.scrumwall.domain.Column
import scala.runtime.RichInt
import org.springframework.jdbc.core.simple.ParameterizedRowMapper
import java.sql.ResultSet
import java.util.HashMap
import java.util.List

class ColumnDaoImpl extends ColumnDao {

  override def getColumns : List[Column] = {
    val mapper = new ParameterizedRowMapper[Column]() {
	  override def mapRow(rs: ResultSet , rowNum: Int) : Column = {
		new Column( new RichInt(rs getInt ColumnDaoImpl.ID), rs getString ColumnDaoImpl.NAME, rs getString ColumnDaoImpl.COLUMN_TYPE)
      }
    }
        
    getNamedParameterJdbcTemplate.query[Column](ColumnDaoImpl.SQL_GET_COLUMNS, new HashMap[String, Object], mapper)
  }
  
}

object ColumnDaoImpl {
  val ID = "ID"
  val COLUMN_TYPE = "columntype"
  val NAME = "name"
  
  val SQL_GET_COLUMNS = "SELECT id, columntype, name FROM col ORDER BY columnorder"
}