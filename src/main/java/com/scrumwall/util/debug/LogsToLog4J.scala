package com.scrumwall.util.debug

import java.lang.Exception
import org.apache.log4j.Logger
import java.lang.Class

trait LogsToLog4J {
	
	private val toLog = Logger.getLogger(this.getClass)
    
	def debug(message: => Any) = {
	  this.log(toLog isDebugEnabled,  toLog.debug(_: Any), message ) 
	}
 
	def debug(exception: Exception)(message: => Any) = {
	  this.log(toLog isDebugEnabled, toLog debug(_: Any, _: Exception), message, exception )
	}
 
	def error(message: => Any) = {
	  this.log(true, toLog error(_: Any), message);
	}
 
	private def log(checkMethod: Boolean, logMethod: Any => Unit, message: => Any) = {
	  if( checkMethod ) {
		  logMethod( message )
	  }
	}
 
	private def log(checkMethod: Boolean, logMethod: (Any, Exception) => Unit, 
                 	message: => Any, exception: Exception) = {
		if( checkMethod ) {
			logMethod( message, exception )
		}
	}
 
}
