package com.scrumwall.item

import com.scrumwall.helper.BaseTestCase
import org.scalatest.FunSuite
import org.scalatest.tools.Runner
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.ModelAndViewAssert
import org.springframework.beans.factory.annotation.Autowired
import com.scrumwall.controller.WelcomeController
import com.scrumwall.dao.item.ItemDao
import junit.framework.TestCase
import org.junit.Test
import org.junit.runner.RunWith

class GetItemTest extends BaseTestCase {

  var itemDao: ItemDao = _
  
  @Autowired def setItemDao(itemDao: ItemDao) = { this.itemDao = itemDao }
  
  @Test def testSomething() {
	val request = new MockHttpServletRequest
	val response = new MockHttpServletResponse
	
	val controller = new WelcomeController(itemDao) 
	val mv = controller.handleRequestInternal(request, response)
 
	assert( mv != null )
  }
  
}
