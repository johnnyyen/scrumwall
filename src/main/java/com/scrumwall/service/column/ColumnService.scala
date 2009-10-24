package com.scrumwall.service.column

import com.scrumwall.domain.Column
import java.util.List

trait ColumnService extends BaseService{

  /**
  * Returns all the columns for this sprint in order  
  */
  def getColumns(sprintId: Int) : List[Column]
  
  def save(column: Column) : Column
  
  /** 
  * @param itemRemoveMode Specifies if the items in the column will be moved to the left column,
  * 						to the right column or removed completely.
  */
  def remove(column: Column, itemRemoveMode: Int)
}