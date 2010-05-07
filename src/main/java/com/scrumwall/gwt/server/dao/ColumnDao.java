package com.scrumwall.gwt.server.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;

import com.scrumwall.gwt.client.ui.Column;

public class ColumnDao extends NamedParameterJdbcDaoSupport {

	private static final String SQL_GET_COLUMNS = 
		"SELECT " +
			"id, columntype, name, columnorder, width, sprintId	" +
		"FROM col " +
		"WHERE " +
			"id >= 0 " +
			"AND sprintId = :sprintId " +
		"ORDER BY columnorder";
	
	public List<Column> getColumns(Integer sprintId){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("sprintId", sprintId);
		
		return getNamedParameterJdbcTemplate().query(SQL_GET_COLUMNS, params, new RowMapper<Column>() {
			@Override
			public Column mapRow(ResultSet rs, int arg1) throws SQLException {
				Column column = new Column(rs.getInt("id"));
				column.setName(rs.getString("name"))
						.setType(rs.getInt("columntype")).
						setSprintId(rs.getInt("sprintid"));
				return column;
			}
		});
	}

}
