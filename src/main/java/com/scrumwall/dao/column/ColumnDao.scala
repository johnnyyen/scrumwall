package com.scrumwall.dao.column

import com.scrumwall.dao.BaseDao
import com.scrumwall.domain.item.Column
import java.util.List

trait ColumnDao extends BaseDao {

  /**
  * Returns all the columns in order  
  */
  def getColumns : List[Column]
  
}
