package dim.livi.digiroad;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.stereotype.Repository;


@Repository
public class NisRepository {
	
	@Autowired
	protected JdbcTemplate jdbc;
	
	 @Autowired
	    public NisRepository(JdbcTemplate jbc) {
	        this.jdbc=jdbc;
	    }
	 

	 public int getValidityManoeuvreCount(Integer[] typelist, String ToBeOrNotToBe) {
		 String in = ToBeOrNotToBe + " (" + StringUtils.join(typelist, ',') + ")";
	        return jdbc.queryForObject("select count(*) count from DR2USER.MANOEUVRE_ELEMENT me " +
										"inner join DR2USER.MANOEUVRE m on me.MANOEUVRE_ID = m.ID " +
										"where m.VALID_TO is not null and ELEMENT_TYPE " + in, itemMapper ); 
	    }
	 


	public List<idtext> getAssetTypes(String term) {
		 return jdbc.query("select ID, NAME from DR2USER.ASSET_TYPE where lower(NAME) like lower(?) order by NAME", new Object[]{"%" + term + "%"}, new RowMapperResultSetExtractor<idtext>(assetType));
	 }
	
	public List<idtext> getMunicipalitys(String term) {
		 return jdbc.query("select ID, NAME_FI from DR2USER.MUNICIPALITY where lower(NAME_FI) like lower(?) order by NAME_FI", new Object[]{"%" + term + "%"}, new RowMapperResultSetExtractor<idtext>(Municipality));
	 }


	    private static final RowMapper<Integer> itemMapper = new RowMapper<Integer>() {
	        @Override
	        public Integer mapRow(ResultSet rs, int rowNum) throws SQLException { 
	            int item = rs.getInt("count");
	            return item; 

			} 
	    };
	    
	    @Deprecated
	    private static final RowMapper<Pair<Integer, String>> assetType_ = new RowMapper<Pair<Integer, String>>() {
	        @Override
	        public Pair<Integer, String> mapRow(ResultSet rs, int rowNum) throws SQLException {
	        	return new ImmutablePair<Integer, String>(rs.getInt("ID"), rs.getString("NAME"));
			} 
	    };
	    
	    private static final RowMapper<idtext> assetType = new RowMapper<idtext>() {
	        @Override
	        public idtext mapRow(ResultSet rs, int rowNum) throws SQLException {
	        	return new idtext(rs.getInt("ID"), rs.getString("NAME"));
			} 
	    };
	    
	    private static final RowMapper<idtext> Municipality = new RowMapper<idtext>() {
	        @Override
	        public idtext mapRow(ResultSet rs, int rowNum) throws SQLException {
	        	return new idtext(rs.getInt("ID"), rs.getString("NAME_FI"));
			} 
	    };

}
