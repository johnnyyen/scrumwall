package com.scrumwall.domain.item

import scala.runtime.RichInt

class Item(var id: RichInt, var content: String, var estimation: RichInt) {
	var sprintId : RichInt = _
	var owner : String = _
  
	def this() = this(null, null, null)
	def this(id: Int, content: String) = this(id, content, null)
	def this(content: String, estimation: RichInt) = this(null, content, estimation)
	
	def getId() : Int = {
	  this.id.abs
	}

	def setId(id: Int) = {
	  this.id = new RichInt(id)
	}
 
	def getEstimation() : Int = {
	  this.estimation.abs
	}
 
	def setEstimation(estimation: Int) = {
	  this.estimation = new RichInt(estimation)
	}
 
	def getContent() : String = {
	  this.content
	}
 
	def setContent(content: String) = {
	  this.content = content
	} 
	
	def getSprintId() : Int = {
	  this.sprintId.abs
	}
 
	def setSprintId(sprintId: Int) = {
	  this.sprintId = new RichInt(sprintId)
	}
	
	def getOwner : String = {
	  this.owner
	}
 
	def setOwner(owner : String) = {
	  this.owner = owner
	}
 
	override def toString() : String = {
	  var result = "["
	  if(this.id != null) result += this.id + ", "
	  if(this.content != null) result += this.content + ", "
	  if(this.estimation != null) result += this.estimation
	  result += "]"
	  result
	}
 
}
