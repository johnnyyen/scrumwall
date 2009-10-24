package com.scrumwall.dao.column

import com.scrumwall.dao.BaseDao
import com.scrumwall.domain.Column
import com.scrumwall.identifiers.ItemRemoveMode
import java.util.List

trait ColumnDao extends BaseDao {

  /**
  * @see ColumnService.getColumns()
  */
  def getColumns(sprintId: Int) : List[Column]

  def save(column: Column): Column
  
  def remove(id: Int)
}