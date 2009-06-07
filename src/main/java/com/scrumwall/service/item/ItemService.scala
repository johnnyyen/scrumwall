package com.scrumwall.service.item

import com.scrumwall.domain.item.Item

trait ItemService {
	
  def get(id: Int) : Item
  
  def save(item: Item) : Item
  
}
