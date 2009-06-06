package com.scrumwall.domain.item

import scala.runtime.RichInt
import scala.runtime.RichString


class Item(var id: RichInt, var content: RichString, var estimation: RichInt) {

	def this() = this(null, null, null)
	def this(id: RichInt, content: RichString) = this(id, content, null)
 
	def getId() : RichInt = {
	  this.id
	}

	def setId(id: int) = {
	  this.id = id.intValue
	}
 
	def getEstimation() : RichInt = {
	  this.estimation
	}
 
	def setEstimation(estimation: int) = {
	  this.estimation = estimation.intValue
	}
 
	def getContent() : RichString = {
	  this.content
	}
 
	def setContent(content: java.lang.String) = {
	  this.content = content
	} 
 
	override def toString() : String = {
	  return "[" + List[String](this.id.toString, this.estimation.toString, this.content) + "]"
	}
 
}
