package com.scrumwall.item

import com.scrumwall.helper.BaseTestCase
import com.scrumwall.service.item.ItemService
import com.scrumwall.domain.item.Item
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.web.ModelAndViewAssert
import org.springframework.beans.factory.annotation.Autowired
import org.junit.Test

class SaveItemTest extends BaseTestCase {

  var itemService: ItemService = _
  
  @Autowired def setItemService(itemService: ItemService) = { this.itemService = itemService }
  
  @Test def canSaveCorrectItem() {
    var item = new Item("TestItemFromTestCase", 5)
    
    item = itemService save item
    
    assert(item.id != null)
  }
  
}
