package com.scrumwall.domain.item

import scala.runtime.RichInt
import scala.runtime.RichString

abstract class Item {
  
	def getId() : RichInt  
   
	def getContent() : RichString
 
	def getEstimation() : RichInt
}
