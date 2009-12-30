package com.scrumwall.column;

import com.scrumwall.dao.column.ColumnDao
import com.scrumwall.helper.BaseTestCase
import com.thoughtworks.selenium.DefaultSelenium
import java.util.HashMap
import org.junit.{After, Before, Test, Assert}
import runtime.RichInt

import org.springframework.beans.factory.annotation.Autowired;

/**
 * Author: silver
 * Date: 19.12.2009
 * Time: 19:45:13
 */

class ColumnSeleniumTest extends BaseTestCase{


    var columnDao: ColumnDao = _

    @Autowired
    def setColumnDao(columnDao: ColumnDao) = { this.columnDao = columnDao }
    
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

    @Test
    def createColumn = {

        selenium open "/scrumwall/Layout.form"
        selenium waitForPageToLoad "500"

        val columnCount = selenium.getXpathCount("//div[@id='columnContainer']/div").intValue();
        val map = new HashMap[String, Object]
        val oldMaxId = columnDao.getNamedParameterJdbcTemplate().queryForInt("select max(id) from col", map)

        selenium click "newColumnButton"

        //give the browser some time to create the column, resize other columns etc
        try{
            selenium wait 500
        }catch{
            case ex: Exception=>
        }

        val newColumnCount = selenium.getXpathCount("//div[@id='columnContainer']/div").intValue();
        Assert.assertEquals("New column was not created", columnCount+1, newColumnCount);
        
        val maxId = columnDao.getNamedParameterJdbcTemplate().queryForInt("select max(id) from col", map)
        Assert.assertTrue("New column was not saved", oldMaxId != maxId)
        debug("max id is " + maxId);

        val header = "jUnitColumn"
        selenium.doubleClick("css=#col_" + maxId + " .columnNameText")
        selenium.`type`("css=#col_" + maxId + " .columnNameInput", header)
        selenium.fireEvent("css=#col_" + maxId + " .columnNameInput","blur")
        //give the browser some time to create the column, resize other columns etc
        try{
            selenium wait 500
        }catch{
            case ex: Exception=>
        }
        Assert.assertEquals("New column header text not changed", header, selenium.getText("css=#col_" + maxId + " .columnNameText"))

        map.put("id", new RichInt(maxId))
        val savedHeader = columnDao.getNamedParameterJdbcTemplate().queryForObject("select name from col where id=:id", map, classOf[String])
        Assert.assertEquals("New column header text not saved", header, savedHeader)

        //"this.browserbot.getUserWindow().";
    }
}
