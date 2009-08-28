package com.scrumwall.service.column

import com.scrumwall.domain.Column
import java.util.List

trait ColumnService extends BaseService{

  /**
  * Returns all the columns in order  
  */
  def getColumns : List[Column]
  
  /**
  * Saves given column
  */
  def save(column: Column) : Column
}