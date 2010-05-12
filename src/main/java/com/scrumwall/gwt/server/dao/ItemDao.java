package com.scrumwall.gwt.server.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;

import com.scrumwall.gwt.shared.ColumnDTO;
import com.scrumwall.gwt.shared.ItemDTO;

public class ItemDao extends NamedParameterJdbcDaoSupport{

	private static final String SQL_GET_FOR_COLUMN = 
		"SELECT " +
			"id, " +
			"content, " +
			"estimation, " +
			"offsetY, " +
			"offsetX, " +
			"owner, " +
			"sprintid, " +
			"col, " +
			"color, " +
			"hoursleft, " +
			"height, " +
			"width " +
		"FROM item " +
		"WHERE col = :column";
	
	public List<ItemDTO> getForColumn(int columnId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("column", columnId);
		
		return getNamedParameterJdbcTemplate().query(SQL_GET_FOR_COLUMN, params, new RowMapper<ItemDTO>() {
			@Override
			public ItemDTO mapRow(ResultSet rs, int index) throws SQLException {
				return new ItemDTO().setId(rs.getInt("id"))
						.setContent(rs.getString("content"))
						.setEstimation(rs.getInt("estimation"))
						.setOffsetY(rs.getDouble("offsetY"))
						.setOffsetX(rs.getDouble("offsetX"))
						.setOwner(rs.getString("owner"))
						.setColumnId(rs.getInt("col"))
						.setColor(rs.getString("color"))
						.setHoursLeft(rs.getInt("hoursLeft"))
						.setHeight(rs.getInt("height"))
						.setWidth(rs.getInt("width"));
			}
		});
	}
	
}
