package com.scrumwall.item

import com.scrumwall.helper.BaseTestCase
import com.scrumwall.service.item.ItemService
import com.scrumwall.domain.item.Item
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.web.ModelAndViewAssert
import org.springframework.beans.factory.annotation.Autowired
import org.junit.Test
import org.springframework.test.context.transaction.TransactionConfiguration
import org.springframework.test.annotation.Rollback

@TransactionConfiguration{val transactionManager="txManager", val defaultRollback=true}
class SaveItemTest extends BaseTestCase {

  var itemService: ItemService = _
  
  @Autowired def setItemService(itemService: ItemService) = { this.itemService = itemService }
  
  @Rollback(true)
  @Test def canSaveCorrectItem() {
    var item = new Item("TestItemFromTestCase", 5)
    
    item = itemService save item
    
    assert(item.id != null)
  }
  
  @Test def canUpdateCorrectItem() {
    var item = new Item(2, "TestItemFromTestCase", 5)
    
    item = itemService save item
    
    val currentItem = itemService get item.getId
    
    Console println currentItem
    
    assert(currentItem.toString === item.toString)
  }
  
}
