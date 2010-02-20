package com.scrumwall.column

import com.scrumwall.dao.item.ItemDao
import org.junit.{After, Before, Test}
import org.junit.Assert._

import org.springframework.beans.factory.annotation.Autowired
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.{WebElement, By}
import com.scrumwall.helper.{BaseUtil, ItemUtil, BaseTestCase, ColumnUtil}

class ColumnSeleniumTest extends BaseTestCase with ColumnUtil with ItemUtil with BaseUtil  {
  var itemDao: ItemDao = _

    @Autowired
    def setColumnDao(itemDao: ItemDao) = { this.itemDao = itemDao }
    
    @Before
    def prepare: Unit = {
      driver = new FirefoxDriver()
    }

    @After
    def shutDown = {
       driver.close()
    }

  @Test
  def createNewColumn = {
    driver.get("http://localhost:8080/scrumwall/Layout.form")
    val columns = getColumns()

    val newColumn = createColumn()
    assertNotNull("The column probably wasn't created", newColumn getAttribute "id")
    deleteColumn( newColumn )
    val columnsAfterDelete = getColumns()

    assertTrue("Column was not deleted or something", compareLists(columns, columnsAfterDelete))
  }

}
