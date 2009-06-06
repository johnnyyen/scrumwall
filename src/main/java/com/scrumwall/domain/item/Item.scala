package com.scrumwall.domain.item

import scala.runtime.RichInt
import scala.runtime.RichString


class Item(var id: RichInt, var content: String, var estimation: RichInt) {

	def this() = this(null, null, null)
	def this(id: RichInt, content: String) = this(id, content, null)
 
	def getId() : RichInt = {
	  this.id
	}

	def setId(id: RichInt) = {
	  this.id = id
	}
 
	def getEstimation() : RichInt = {
	  this.estimation
	}
 
	def setEstimation(estimation: RichInt) = {
	  this.estimation = estimation
	}
 
	def getContent() : String = {
	  this.content
	}
 
	def setContent(content: String) = {
	  this.content = content
	} 
 
	override def toString() : String = {
	  return "[" + List[String](this.id.toString, this.estimation.toString, this.content) + "]"
	}
 
}
