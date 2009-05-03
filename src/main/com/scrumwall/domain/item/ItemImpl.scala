package com.scrumwall.domain.item

import scala.runtime.RichInt
import scala.runtime.RichString


class ItemImpl(id: RichInt, content: RichString, estimation: RichInt) extends Item {

	def this() = this(null, null, null)
	def this(id: RichInt, content: RichString) = this(id, content, null)
 
	override def getId() : RichInt = {
	  this.id
	}
 
	override def getEstimation() : RichInt = {
	  this.estimation
	}
 
	override def getContent() : RichString = {
	  this.content
	}
 
	
}
