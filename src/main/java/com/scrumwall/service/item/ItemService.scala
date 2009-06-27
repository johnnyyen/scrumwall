package com.scrumwall.service.item

import com.scrumwall.domain.item.Item
import java.util.List

trait ItemService {
	
  def get(id: Int) : Item
  
  def save(item: Item) : Item
  
  def getForSprint(sprintId: Int) : List[Item]
  
}
