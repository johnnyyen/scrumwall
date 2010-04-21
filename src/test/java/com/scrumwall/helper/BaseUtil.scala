package com.scrumwall.helper

import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.{RenderedWebElement, WebElement}
import org.junit.Assert._

trait BaseUtil {

  var driver: FirefoxDriver = _

  implicit def webElement2RenderedWebElement(element: WebElement) = element.asInstanceOf[RenderedWebElement]

  def compareLists(firstList: List[WebElement], secondList: List[WebElement]): Boolean = {
    assertEquals("The sizes of the column lists should be the same", firstList.size, secondList.size)

    for(i <- 0 until firstList.length) {
      val elem1 = firstList(i)
      val elem2 = secondList(i)
      if((elem1 getAttribute "id") != (elem2 getAttribute "id")) {
        assertEquals("Elements in both lists need to be the same", elem1 getAttribute "id", elem2 getAttribute "id")
      }
    }
    return true
  }

}