package com.scrumwall.service.item

import com.scrumwall.domain.Item
import java.util.List

trait ItemService extends BaseService{
	
  def get(id: Int) : Item
  
  def save(item: Item) : Item
  
  def getForSprint(sprintId: Int) : List[Item]
  
  def getItems(columnId: Int) : List[Item]

  def remove(id: Int)
  
}
