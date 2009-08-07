package com.scrumwall.service.column

import com.scrumwall.domain.item.Column
import java.util.List

trait ColumnService {

  /**
  * Returns all the columns in order  
  */
  def getColumns : List[Column]
  
}
