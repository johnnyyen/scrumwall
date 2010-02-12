package com.scrumwall.helper

import org.scalatest.junit.JUnit3Suite
import org.junit.runner.RunWith
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.transaction.TransactionConfiguration
import org.springframework.test.AbstractTransactionalDataSourceSpringContextTests
import org.springframework.transaction.annotation.Transactional
import com.scrumwall.util.debug.LogsToLog4J
import org.openqa.selenium.WebElement

@Transactional()
@TransactionConfiguration{val transactionManager="txManager", val defaultRollback=true}
@RunWith(classOf[org.springframework.test.context.junit4.SpringJUnit4ClassRunner])
@ContextConfiguration{val locations = Array("classpath:applicationContext.xml", "classpath:test-ds.xml"), val inheritLocations = false}
abstract class BaseTestCase extends AbstractTransactionalDataSourceSpringContextTests with JUnit3Suite with LogsToLog4J {

  def compareLists(firstList: List[WebElement], secondList: List[WebElement]): Boolean = {
    if(firstList.size != secondList.size) {
      Console println "The sizes were different"
      return false
    }

    for(elem1 <- firstList; elem2 <- secondList) {
      if((elem1 getAttribute "id") != (elem2 getAttribute "id")) {
        Console println ((elem1 getAttribute "id") + " does not equal " + (elem2 getAttribute "id"))
        return false
      }
    }
    return true
  }

}
