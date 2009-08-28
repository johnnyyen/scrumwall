package com.scrumwall.item

import com.scrumwall.helper.BaseTestCase
import com.scrumwall.service.item.ItemService
import com.scrumwall.domain.Item
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.web.ModelAndViewAssert
import org.springframework.beans.factory.annotation.Autowired
import org.junit.Test
import org.springframework.test.annotation.Rollback
import scala.runtime.RichInt

class SaveItemTest extends BaseTestCase {

  val CONTENT = "TestItemFromTestCase"
  
  var itemService: ItemService = _
  
  @Autowired def setItemService(itemService: ItemService) = { this.itemService = itemService }
  
  @Rollback(true)
  @Test def canSaveItem() {
    var item = this createItem null
    
    item = itemService save item
    
    debug("Got item with id: " + item.id)
    
    assert(item.id != null)
  }
  
  @Rollback(true)
  @Test def canUpdateItem() {
    var item = this createItem null
    
    item = itemService save item
    
    assert( item.content === CONTENT )
    
    item.content = "TestItemFromTestCaseUpdated"
    
    item = itemService save item
    
    val currentItem = itemService get item.getId
    
    assert(currentItem.toString === item.toString)
  }

  private def createItem(id: RichInt): Item = {
    var item = new Item()
    if(id != null) { item.id = id }
    item setContent CONTENT
    item setColumn 1
    item setOffsetX 0
    item setOffsetY 0
    item setColor "testColor"
    item setWidth 100
    item setHeight 100
    item
  }
  
}
