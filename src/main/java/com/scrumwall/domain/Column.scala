package com.scrumwall.domain

import scala.runtime.RichInt

class Column(var id: RichInt, var name: String, var columnType: String) {
  
	def this(id: Int, name: String) = this(id, name, null) 
 
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
    
    override def toString = {
      "[" + this.id + ", " + this.columnType + ", " + this.name
      
    }
    
}

object Column {
  val NOT_STARTED = "NOT_STARTED"
  val DONE = "DONE"
}
