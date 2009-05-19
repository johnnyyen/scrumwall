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
import org.springframework.beans.factory.annotation.Autowired

@RunWith(classOf[org.springframework.test.context.junit4.SpringJUnit4ClassRunner])
@ContextConfiguration{val locations = Array("classpath:applicationContext.xml", "classpath:test-ds.xml"), val inheritLocations = false}
class GetItemTest extends TestCase with FunSuite{

  var itemDao: ItemDao = null
  
  @Autowired def setItemDao(itemDao: ItemDao) = { this.itemDao = itemDao }
  
  @Test def testSomething() {
	val request = new MockHttpServletRequest
	val response = new MockHttpServletResponse
	
	val controller = new WelcomeController(itemDao) 
	val mv = controller.handleRequestInternal(request, response)
 
	assert(mv != null)
  }
  
  test("You should not be able to send in strings") {
  }
  
}
