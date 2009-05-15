package com.scrumwall.util.debug

import java.lang.Exception
import org.apache.log4j.Logger
import java.lang.Class

trait LogsToLog4J {
	
	private val toLog = Logger.getLogger(this.getClass)
   
	def debug(message: Any) = {
	  this.log( toLog.debug(_: Any), message ) 
	}
 
	def debug(message: Any, exception: Exception) = {
	  this.log( toLog debug(_: Any, _: Exception), message, exception )
	}
 
	def error(message: Any) = {
	  this.log( toLog error(_: Any), message);
	}
 
	private def log(logMethod: Any => Unit, message: => Any) = {
	  if( toLog.isDebugEnabled ) {
		  logMethod( message )
	  }
	}
 
	private def log(logMethod: (Any, Exception) => Unit, message: => Any, exception: Exception) = {
		if( toLog.isDebugEnabled ) {
			logMethod( message, exception )
		}
	}
 
}
