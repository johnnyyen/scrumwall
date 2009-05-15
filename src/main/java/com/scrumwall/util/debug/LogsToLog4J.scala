package com.scrumwall.util.debug

import java.lang.Exception
import org.apache.log4j.Logger
import java.lang.Class

trait LogsToLog4J {
	
	private val toLog = Logger.getLogger(this.getClass)  
  
	private val debugMethod = { toLog debug(_: Any) } 
	private val debugException = { toLog debug(_: Any, _: Exception) } 
  
	private val errorMethod = { toLog error(_: Any)}
 
	def debug(message: Any) = {
	  this.log( this.debugMethod, message ) 
	}
 
	def debug(message: Any, exception: Exception) = {
	  this.log( this.debugException, message, exception )
	}
 
	def error(message: Any) = {
	  this.log( this.errorMethod, message);
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
