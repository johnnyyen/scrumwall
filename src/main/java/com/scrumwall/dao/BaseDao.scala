package com.scrumwall.dao

import org.springframework.jdbc.core.simple.SimpleJdbcDaoSupport
import com.scrumwall.util.debug.LogsToLog4J

class BaseDao extends SimpleJdbcDaoSupport with LogsToLog4J {

}
