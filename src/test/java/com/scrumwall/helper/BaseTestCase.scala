package com.scrumwall.helper

import org.scalatest.FunSuite
import org.scalatest.junit.JUnit3Suite
import junit.framework.TestCase
import org.junit.runner.RunWith
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.transaction.TransactionConfiguration
import org.springframework.transaction.annotation.Transactional

@Transactional()
@TransactionConfiguration{val transactionManager="txManager", val defaultRollback=true}
@RunWith(classOf[org.springframework.test.context.junit4.SpringJUnit4ClassRunner])
@ContextConfiguration{val locations = Array("classpath:applicationContext.xml", "classpath:test-ds.xml"), val inheritLocations = false}
abstract class BaseTestCase extends TestCase with JUnit3Suite {
  
}
