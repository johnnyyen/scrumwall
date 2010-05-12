package com.scrumwall.gwt.server.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;

import com.scrumwall.gwt.shared.ColumnDTO;

public class ColumnDao extends NamedParameterJdbcDaoSupport {

	private static final String SQL_GET_COLUMNS = 
		"SELECT " +
			"id, columntype, name, columnorder, width, sprintId	" +
		"FROM col " +
		"WHERE " +
			"id >= 0 " +
			"AND sprintId = :sprintId " +
		"ORDER BY columnorder";
	
	public List<ColumnDTO> getColumns(Integer sprintId){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("sprintId", sprintId);
		
		return getNamedParameterJdbcTemplate().query(SQL_GET_COLUMNS, params, new RowMapper<ColumnDTO>() {
			@Override
			public ColumnDTO mapRow(ResultSet rs, int index) throws SQLException {
				return new ColumnDTO().setId(rs.getInt("id"))
						.setName(rs.getString("name"))
						.setType(rs.getString("columntype"))
						.setSprintId(rs.getInt("sprintid"));
			}
		});
	}

}
