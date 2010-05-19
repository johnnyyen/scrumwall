package com.scrumwall.gwt.server.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;

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
			"col, " +
			"color, " +
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
						.setEstimation(rs.getBigDecimal("estimation") != null ? 
											Integer.valueOf(rs.getBigDecimal("estimation").toString()) : 
											null)
						.setOffsetY(rs.getDouble("offsetY"))
						.setOffsetX(rs.getDouble("offsetX"))
						.setOwner(rs.getString("owner"))
						.setColumnId(rs.getInt("col"))
						.setColor(rs.getString("color"))
						.setHeight(rs.getInt("height"))
						.setWidth(rs.getInt("width"));
			}
		});
	}
	
	public void save(ItemDTO item) {
		if(item.getId() != null) {
			this.update(item);
		}
	}
	
	private static final String SQL_UPDATE = 
		"UPDATE item " +
		"SET content = :content, " +
			"estimation = :estimation, " +
			"offsetY = :offsetY, " +
			"offsetX = :offsetX, " +
			"owner = :owner, " +
			"col = :col, " +
			"color = :color, " +
			"height = :height, " +
			"width = :width " +
		"WHERE id = :id"; 
	
	private void update(ItemDTO item) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put( "content", item.getContent() );
	    params.put( "estimation",item.getEstimation() );
	    params.put( "id", item.getId() );
	    params.put( "offsetX", item.getOffsetX() );
	    params.put( "offsetY", item.getOffsetY() );
	    params.put( "owner", item.getOwner() );
	    params.put( "col", item.getColumnId() );
	    params.put( "color", item.getColor() );
	    params.put( "width", item.getWidth() );
	    params.put( "height", item.getHeight() );
	    
	    getNamedParameterJdbcTemplate().update(SQL_UPDATE, params);
	}
	
}
