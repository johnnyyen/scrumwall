package com.scrumwall.service.column

import com.scrumwall.util.debug.LogsToLog4J
import com.scrumwall.dao.column.ColumnDao
import com.scrumwall.domain.Column
import java.util.List

class ColumnServiceImpl extends ColumnService with LogsToLog4J{

  var columnDao: ColumnDao = _
  def setColumnDao(columnDao: ColumnDao){
    this.columnDao = columnDao
  }
  
  override def getColumns : List[Column] = {
    debug("Getting columns")
    this.columnDao.getColumns
  }
  
  override def save(column: Column): Column = {
    debug("saving column " + column)
    this.columnDao.save(column)
    column
  }
}
