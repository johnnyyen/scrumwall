package com.scrumwall.column

import com.scrumwall.dao.item.ItemDao
import org.junit.{After, Before, Test}
import org.junit.Assert._

import org.springframework.beans.factory.annotation.Autowired
import org.openqa.selenium.firefox.FirefoxDriver
import com.scrumwall.helper.{BaseUtil, ItemUtil, BaseTestCase, ColumnUtil}
import org.openqa.selenium.{NoSuchElementException, RenderedWebElement, WebElement, By}

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
  def createAndDeleteColumn = {

    val newColumn = createColumn()

    val nameInput = newColumn findElement (By className "columnNameInput")
    assertTrue("The column name input box is hidden", nameInput isDisplayed)
    nameInput sendKeys COLUMN_NAME + "\n"
    assertFalse("The column name input box is hidden", nameInput isDisplayed)

    val columnName = newColumn findElement (By className "columnNameText") getText()
    assertEquals("Column has the previously set name", COLUMN_NAME, columnName)

    deleteColumn( newColumn )
  }

  @Test
  def changeColumnOrder = {
    val newColumn = createColumn()
    val inProgressColumn = driver.findElement(By className "inProgressColumn")

    newColumn findElement (By className "colHeader") dragAndDropBy (-1 * inProgressColumn.getSize().getWidth.toInt, 0)
    Thread sleep 500 //Dom not ready otherwise
    assertTrue("The new column is before the in progress column", isColumnBefore(newColumn, inProgressColumn))

    deleteColumn(newColumn)
  }

  @Test
  def deleteColumnDeleteItems = {
    val newColumn = createColumn ()

    val item = createItem(newColumn, "green")

    deleteColumn(newColumn, false)

    driver findElement (By className "deleteItemsButton") click()

    try {
      driver findElement (By id (item getAttribute "id"))
      fail("Item is still somewhere in the dom.")
    } catch {
  case e: Exception => true
    }


    assertTrue("The previously created column should not exist anymore",
      existsColumnWithId(newColumn getAttribute "id", getColumns()))
  }

}
