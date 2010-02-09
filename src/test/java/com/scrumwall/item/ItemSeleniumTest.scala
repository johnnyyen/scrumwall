package com.scrumwall.item

import com.scrumwall.dao.item.ItemDao
import com.scrumwall.helper.BaseTestCase
import com.thoughtworks.selenium.DefaultSelenium
import java.util.HashMap
import org.junit.{After, Before, Test, Assert}
import runtime.RichInt

import org.springframework.beans.factory.annotation.Autowired;

class ItemSeleniumTest extends BaseTestCase{

  var itemDao: ItemDao = _

    @Autowired
    def setColumnDao(itemDao: ItemDao) = { this.itemDao = itemDao }
    
    var selenium: DefaultSelenium = _

    @Before
    def prepare = {
        selenium = new DefaultSelenium("localhost",4444, "*firefox", "http://localhost:8080/")
        selenium.start()
        selenium.getEval("window.resizeTo(1280,1024); window.moveTo(0,0)")
        //bypassing "method should be void"
        assert(true)

    }

    @After
    def shutDown = {
        selenium stop
    }
    
    def delay(timeout: long) = {
      Thread sleep timeout
    }
    
    //@Test
    def createItem = {
    	selenium open "/scrumwall/Layout.form"
        selenium waitForPageToLoad "500"
        
        val content = "created by jUnit"
        val map = new HashMap[String, Object]
        
        val itemCount = Integer.parseInt(selenium.getEval("selenium.browserbot.getCurrentWindow().jQuery('#col_0 .item').length"))
        selenium.dragAndDropToObject("css=.sector.green", "id=col_0");
		delay(500)
		
		val newItemCount = Integer.parseInt(selenium.getEval("selenium.browserbot.getCurrentWindow().jQuery('#col_0 .item').length"))
		val maxId = itemDao.getNamedParameterJdbcTemplate().queryForInt("select max(id) from item where col=0", map)
		if(!selenium.isElementPresent("id=item_"+maxId)){
        	Assert.fail("item was not created in UI")
        }
		
		Assert.assertTrue("item was not saved to DB", 0 < maxId)
		
		selenium.`type`("xpath=//div[@id='item_" + maxId + "']/textarea", content)
		selenium.fireEvent("xpath=//div[@id='item_" + maxId + "']/textarea","blur")
		
		delay(500)
		
		map.put("id", new RichInt(maxId))
		val newContent = itemDao.getNamedParameterJdbcTemplate().queryForObject("select content from item where id=:id", map, classOf[String])
		Assert.assertEquals("id " +maxId +" content was not saved to DB", content, newContent)
    }
}
