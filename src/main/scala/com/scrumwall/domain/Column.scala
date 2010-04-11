package com.scrumwall.domain

import scala.runtime.RichInt
import scala.runtime.RichDouble

class Column(var id: RichInt, var name: String, var columnType: String) {
  
	var width: RichDouble = _
	var order: RichInt = _
	var sprintId: RichInt = _
 
	def this(id: Int, name: String) = this(id, name, Column.REGULAR) 
	def this() = this(null, null, Column.REGULAR)
 
	def getId: Int = {
	  this.id.abs
	}
 
	def setId(id: Int) = {
	  this.id = new RichInt(id)
	}
 
 	def getColumnType: String = {
 	  this.columnType
 	}
 
  	def setColumnType(columnType: String) = {
  	  this.columnType = columnType
  	}
  
   	def getName: String = {
   	  this.name
   	}
   
    def setName(name: String) = {
      this.name = name
    }
    
    def getWidth: Double = {
      this.width.abs
    }
    
    def setWidth(width: Double){
      this.width = new RichDouble(width)
    }
    
    def getOrder: Int = {
   	  this.order.abs
   	}
   
    def setOrder(order: Int) = {
      this.order = new RichInt(order)
    }
    
    def getSprintId: Int = {
   	  this.sprintId.abs
   	}
   
    def setSprintId(sprintId: Int) = {
      this.sprintId = new RichInt(sprintId)
    }
    
    override def toString = {
      "[" + this.id + ", " + this.sprintId + ", " + this.columnType + ", " + this.name + ", " + this.width + "]"
      
    }
    
}

object Column {
  val NOT_STARTED = "NOT_STARTED"
  val DONE = "DONE"
  val REGULAR = "REGULAR"
}
