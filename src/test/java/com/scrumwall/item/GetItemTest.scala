package com.scrumwall.item

import org.scalatest.FunSuite
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.web.ModelAndViewAssert
import com.scrumwall.controller.WelcomeController
import com.scrumwall.dao.item._
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ContextConfiguration

@ContextConfiguration("test-context.xml")
class GetItemTest extends FunSuite{

  @Autowired var itemDao: ItemDao = null
  
  test("You should not be able to send in strings") {
    val request = new MockHttpServletRequest
    val response = new MockHttpServletResponse
    
    val controller = new WelcomeController(itemDao) 
    val mv = controller.handleRequestInternal(request, response)
    assert(mv != null)
  }
  
}
