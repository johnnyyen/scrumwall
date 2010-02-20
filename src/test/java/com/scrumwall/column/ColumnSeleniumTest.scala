package com.scrumwall.column

import com.scrumwall.dao.item.ItemDao
import org.junit.{After, Before, Test}
import org.junit.Assert._

import org.springframework.beans.factory.annotation.Autowired
import org.openqa.selenium.firefox.FirefoxDriver
import com.scrumwall.helper.{BaseUtil, ItemUtil, BaseTestCase, ColumnUtil}
import org.openqa.selenium.{RenderedWebElement, WebElement, By}

class ColumnSeleniumTest extends BaseTestCase with ColumnUtil with ItemUtil with BaseUtil  {
  var itemDao: ItemDao = _

  val COLUMN_NAME = "TestColumnName"

    @Autowired
    def setColumnDao(itemDao: ItemDao) = { this.itemDao = itemDao }
    
    @Before
    def prepare: Unit = {
      driver = new FirefoxDriver()
      driver.get("http://localhost:8080/scrumwall/Layout.form")
    }

    @After
    def shutDown = {
       driver.close()
    }

  @Test
  def createNewColumn = {

    val newColumn = createColumn()

    val nameInput = newColumn findElement (By className "columnNameInput")
    assertTrue("The column name input box is hidden", nameInput isDisplayed)
    nameInput sendKeys COLUMN_NAME + "\n"
    assertFalse("The column name input box is hidden", nameInput isDisplayed)

    val columnName = newColumn findElement (By className "columnNameText") getText()
    assertEquals("Column has the previously set name", COLUMN_NAME, columnName)

    deleteColumn( newColumn )
  }

}
