package com.scrumwall.controller

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import org.springframework.web.servlet.ModelAndView
import org.springframework.web.servlet.mvc.AbstractController
import com.scrumwall.util.debug.LogsToLog4J

class LayoutController extends AbstractController with LogsToLog4J {
	
	override def handleRequestInternal(request: HttpServletRequest, response: HttpServletResponse) : ModelAndView = {
		return new ModelAndView("layout");
	}
}
