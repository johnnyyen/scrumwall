package com.scrumwall.item

import org.scalatest.FunSuite
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.web.ModelAndViewAssert
import com.scrumwall.controller.WelcomeController
import com.scrumwall.dao.item.ItemDao
import junit.framework.TestCase
import org.junit.Test
import org.junit.runner.RunWith
import org.scalatest.tools.Runner
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.AbstractSpringContextTests

@RunWith(classOf[org.springframework.test.context.junit4.SpringJUnit4ClassRunner])
@ContextConfiguration(locations={"test-context.xml"})
class GetItemTest extends TestCase with FunSuite{

  var itemDao: ItemDao = null
  
  @Test def testSomething() {
    assert(1==1)
  }
  
  test("You should not be able to send in strings") {
    val request = new MockHttpServletRequest
    val response = new MockHttpServletResponse
    
    val controller = new WelcomeController(itemDao) 
    val mv = controller.handleRequestInternal(request, response)
    assert(mv != null)
  }
  
}
