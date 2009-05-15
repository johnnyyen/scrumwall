package com.scrumwall.controller

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController
import com.scrumwall.dao.item.ItemDao
import scala.collection.jcl.HashMap
import com.scrumwall.domain.item.Item

class WelcomeController(val itemDao: ItemDao) extends AbstractController {
  
	override def handleRequestInternal(request: HttpServletRequest, response: HttpServletResponse) : ModelAndView = {
		val item = itemDao.getItem(1);
		val data = new HashMap[java.lang.String, Item]
		data("item") = item
		val mv = new ModelAndView("Welcome", data.underlying);
		mv
	}
 
}
