package com.scrumwall.helper

import org.openqa.selenium.{WebElement, By}

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
    getNewColumn(beforeNewColumn, getColumns)
  }

  def deleteColumn(column: WebElement) = {
    column findElement (By className "deleteColumnButton") click()
  }

}