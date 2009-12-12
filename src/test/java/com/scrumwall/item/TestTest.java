package com.scrumwall.item;

import com.thoughtworks.selenium.SeleneseTestCase;
import junit.framework.TestCase;

public class TestTest extends SeleneseTestCase {
	public void setUp() throws Exception {
        super.setUp();
		setUp("http://localhost:4444/", "*firefox");
	}
	
	public void testUntitled() throws Exception {
		selenium.open("/scrumwall/Layout.form#");

		//selenium.click("//div[@id='col.15']/div[1]/a");
		//selenium.click("newColumnButton");
//		selenium.click("//div[@id='col.14']/div[1]/a");
		
//		selenium.dragAndDropToObject("css=.sector.green", "css=div[id=col.0]");
		
//		selenium.
		
//		selenium.
	}
	
}
