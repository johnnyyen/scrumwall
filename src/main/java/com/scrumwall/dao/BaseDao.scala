package com.scrumwall.dao

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport
import com.scrumwall.util.debug.LogsToLog4J

class BaseDao extends NamedParameterJdbcDaoSupport with LogsToLog4J {

  def getLastInsertedId() : Int = {
    getJdbcTemplate.queryForInt("call IDENTITY()")
  }
  
}
