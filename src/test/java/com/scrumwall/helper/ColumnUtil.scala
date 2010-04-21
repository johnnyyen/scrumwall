package com.scrumwall.helper

import org.openqa.selenium.{WebElement, By}
import org.junit.Assert._

trait ColumnUtil extends BaseUtil {

  def getColumns() : List[WebElement] = {
    val columnContainer = driver.findElement(By.id("columnContainer"))
    columnContainer.findElements(By.className("column")).toArray(new Array[WebElement](0)).toList
  }

  private def getNewColumn(before: List[WebElement], after: List[WebElement]) : WebElement = {
    val minus: List[WebElement] = after -- before
    if (minus.size > 1) {
      throw new IllegalArgumentException("More than one new column created")
    } else if(minus isEmpty) {
      throw new IllegalArgumentException("No new columns created")
    }
    minus.head
  }

  def createColumn(): WebElement = {
    val beforeNewColumn = getColumns
    driver findElement (By id "newColumnButton") click()
    val newColumn = getNewColumn(beforeNewColumn, getColumns)
    assertNotNull("New column exists with an id", newColumn getAttribute "id")
    newColumn
  }

  def deleteColumn(column: WebElement): Unit = {
    deleteColumn(column, true)
  }
  def deleteColumn(column: WebElement, doAsserts: Boolean) = {
    val columnId = column getAttribute "id"
    column findElement (By className "deleteColumnButton") click()
    if(doAsserts){
      assertTrue("The previously created column should not exist anymore", existsColumnWithId(columnId, getColumns()))
    }
  }

  def existsColumnWithId(columnId: String, columns: List[WebElement]): Boolean = {
    columns.foreach((column: WebElement) => {
      if(columnId == (column getAttribute "id")) false})
    true
  }

  def isColumnBefore(firstColumn: WebElement, secondColumn: WebElement): Boolean = {
    var firstVisited = false
    val columns = getColumns()
    columns.foreach((column: WebElement) => {
      if((column getAttribute "id") == (firstColumn getAttribute "id")) {
        firstVisited = true
      }
      if(((column getAttribute "id") == (secondColumn getAttribute "id")) && !firstVisited) {
        return false
      }
    })
    return true
  }
}