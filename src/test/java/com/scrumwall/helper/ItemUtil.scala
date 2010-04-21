package com.scrumwall.helper

import org.openqa.selenium.{WebElement, By}

trait ItemUtil extends BaseUtil {

  def createItem(column: WebElement, color: String): WebElement = {
    val itemCreator = driver.findElement(By className color)
    itemCreator.dragAndDropOn(column findElement (By className "colBody"))
    Thread sleep 3000
    column findElement (By className "item")
  }

}