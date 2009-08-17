package com.scrumwall.domain

import scala.runtime.RichInt
import scala.runtime.RichDouble
import com.scrumwall.util.debug.LogsToLog4J
import java.lang.Integer

class Item(var id: RichInt, var content: String, var estimation: RichInt) extends LogsToLog4J {
	var sprintId : RichInt = _
	var owner : String = _
	var column: RichInt = _
	var offsetX: RichDouble = _
	var offsetY: RichDouble = _
	var color: String = _
	var hoursLeft: RichInt = _
 
	def this() = this(null, null, null)
	def this(id: Int, content: String) = this(id, content, null)
	def this(content: String, estimation: RichInt) = this(null, content, estimation)
	
	def getId() : Int = {
	  this.id.abs
	}

	def setId(id: Int) = {
	  this.id = new RichInt(id)
	}
 
	def getEstimation() : Integer = {
	  if(this.estimation != null) {
		  this.estimation.abs
	  } else {
	    null
	  }
	}
 
	def setEstimation(estimation: Integer) = {
	  if(estimation != null) {
		  this.estimation = new RichInt(estimation.intValue)
	  }
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

	def setOwner (owner : String) = {
	  this.owner = owner
	}
 
    def getOffsetX : Double = {
      //FIXME: obvious
	  var multiplier = -1;
	  if(this.offsetX > 0) {
	    multiplier = 1;
	  }
	  return multiplier * this.offsetX.abs
	}

	def setOffsetX (offsetX : Double) = {
	  this.offsetX = new RichDouble(offsetX)
	}
	
	def getOffsetY : Double = {
	  //FIXME: obvious
	  var multiplier = -1;
	  if(this.offsetY > 0) {
	    multiplier = 1;
	  }
	  return multiplier * this.offsetY.abs
	}

	def setOffsetY(offsetY : Double) = {
	  this.offsetY = new RichDouble(offsetY)
	}
 
	def getColumn : Int = {
	  this.column.abs
	}
 
	def setColumn(column : Int) = {
	  this.column = new RichInt(column)
	}
 
	def getColor : String = {
	  this.color
	}
 
	def setColor(color: String) = {
	  this.color = color
	}
 
	def setHoursLeft(hoursLeft: Integer) = {
	  if(hoursLeft != null) {
		  this.hoursLeft = new RichInt(hoursLeft.intValue)
	  }
	}
 
	def getHoursLeft() : Integer = {
	  if(this.hoursLeft != null) {
		  this.hoursLeft.abs
	  } else {
	    null
	  }
	}
 
	override def toString() : String = {
	  var result = "["
	  if(this.id != null) result += this.id + ", "
	  if(this.content != null) result += this.content + ", "
	  if(this.estimation != null) result += this.estimation + ", "
	  if(this.owner != null) result += this.owner + ", "
	  if(this.offsetX != null) result += this.offsetX + ", "
	  if(this.offsetY != null) result += this.offsetY + ", "
	  if(this.column != null) result += this.column + ", "
	  if(this.sprintId != null) result += this.sprintId
	  result += "]"
	  result
	}
 
}
