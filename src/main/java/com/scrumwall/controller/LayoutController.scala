package com.scrumwall.controller

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController

class LayoutController extends AbstractController{
	
	override def handleRequestInternal(request: HttpServletRequest, response: HttpServletResponse) : ModelAndView = {
		return new ModelAndView("layout");
	}
}
