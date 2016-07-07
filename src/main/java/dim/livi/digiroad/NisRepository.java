package dim.livi.digiroad;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Future;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Repository;


@Repository
public class NisRepository {
	
	
	protected JdbcTemplate jdbc;
	
	@Autowired
    public NisRepository(JdbcTemplate jbc, JdbcTemplate jdbc) {
        this.jdbc=jdbc;
    }
	 
	 

	 public int getValidityManoeuvreCount(Integer[] typelist, String ToBeOrNotToBe) {
		 String in = ToBeOrNotToBe + " (" + StringUtils.join(typelist, ',') + ")";
	        return jdbc.queryForObject("select count(*) count from DR2USER.MANOEUVRE_ELEMENT me " +
										"inner join DR2USER.MANOEUVRE m on me.MANOEUVRE_ID = m.ID " +
										"where m.VALID_TO is not null and ELEMENT_TYPE " + in, itemMapper ); 
	    }
	 


	public List<idtext> getAssetTypes(String term) {
		 return jdbc.query("select ID, NAME from DR2USER.ASSET_TYPE where lower(NAME) like lower(?) order by NAME", new Object[]{term + "%"}, new RowMapperResultSetExtractor<idtext>(assetTypeMapper));
	 }
	
	public List<idtext> getMunicipalitys(String term) {
		 return jdbc.query("select ID, NAME_FI from DR2USER.MUNICIPALITY where lower(NAME_FI) like lower(?) order by NAME_FI", new Object[]{term + "%"}, new RowMapperResultSetExtractor<idtext>(MunicipalityMapper));
	 }
	
	@Async
	public Future<ArrayList<rawModifiedResult>> getRawModifiedResult(String startDate, String stopDate, String kunnat, String tietolajit) {
		 return new AsyncResult<ArrayList<rawModifiedResult>>((ArrayList<rawModifiedResult>) jdbc.query("select MOD_DATE, ASSET_TYPE_ID, NAME, MUNICIPALITYCODE, NAME_FI, count(MOD_DATE) COUNT from ( " +
		  "select ass.ASSET_TYPE_ID, at.NAME, rl.MUNICIPALITYCODE, mu.NAME_FI, to_char(cast(coalesce(ass.MODIFIED_DATE, ass.CREATED_DATE) as date), 'DD-MM-YYYY') MOD_DATE from DR2USER.ASSET ass " +
		  "inner join DR2USER.ASSET_LINK al on ass.ID = al.ASSET_ID " +
		  "inner join DR2USER.LRM_POSITION lrm on al.POSITION_ID = lrm.ID " +
		  "inner join VVH.ROADLINK@VVH rl on lrm.LINK_ID = rl.LINKID " +
		  "inner join DR2USER.MUNICIPALITY mu on rl.MUNICIPALITYCODE = mu.ID " +
		  "inner join DR2USER.ASSET_TYPE at on ass.ASSET_TYPE_ID = at.ID " +
		  "where ass.ASSET_TYPE_ID in (" + tietolajit + ") " +
		  "and rl.MUNICIPALITYCODE in (" + kunnat + ") " +
		  "and ass.VALID_TO is null " +
		  "and coalesce(ass.MODIFIED_DATE, ass.CREATED_DATE) between to_date(?, 'DD-MM-YYYY') AND to_date(?, 'DD-MM-YYYY') " +
		  ") " +
		"group by ASSET_TYPE_ID, NAME, MUNICIPALITYCODE, NAME_FI, MOD_DATE " +
		"order by to_date(MOD_DATE, 'DD-MM-YYYY')", new Object[]{startDate, stopDate}, new RowMapperResultSetExtractor<rawModifiedResult>(rawModifiedResultMapper)));
	 }
	
	public List<String> getModDates(String startDate, String stopDate, String kunnat, String tietolajit) {
		 return jdbc.query("select distinct to_char(cast(coalesce(ass.MODIFIED_DATE, ass.CREATED_DATE) as date), 'DD-MM-YYYY') MOD_DATE from DR2USER.ASSET ass " +
		"inner join DR2USER.ASSET_LINK al on ass.ID = al.ASSET_ID " +
		"inner join DR2USER.LRM_POSITION lrm on al.POSITION_ID = lrm.ID " +
		"inner join VVH.ROADLINK@VVH rl on lrm.LINK_ID = rl.LINKID " +
		"where ass.ASSET_TYPE_ID in (" + tietolajit + ") " +
		"and rl.MUNICIPALITYCODE in (" + kunnat + ") " +
		"and ass.VALID_TO is null " +
		"and coalesce(ass.MODIFIED_DATE, ass.CREATED_DATE) between to_date(?, 'DD-MM-YYYY') AND to_date(?, 'DD-MM-YYYY') " +
		"order by to_date(MOD_DATE, 'DD-MM-YYYY')", new Object[]{startDate, stopDate}, new RowMapperResultSetExtractor<String>(modDateMapper));
	 }
	
	public List<jqGridJsonTypeRow> getServiceUsers(Integer rows, Integer page, String sidx, String sord) {
		int start = (page - 1) * rows;
		int stop = start + rows;
		 return jdbc.query("select USERNAME, CONFIGURATION from (" +
							  "select a.*, ROWNUM rnum from (" +
							    "select * from DR2USER.SERVICE_USER ORDER BY " + sidx + " " + sord +
							  ") a where rownum <= ?" +
							") where rnum > ?", new Object[]{stop, start}, new RowMapperResultSetExtractor<jqGridJsonTypeRow>(serviceRowMapper));
	 }
	
	 public int getServiceUserCount() {
	        return jdbc.queryForObject("select count(*) count from DR2USER.SERVICE_USER", itemMapper ); 
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
	    
	    private static final RowMapper<idtext> assetTypeMapper = new RowMapper<idtext>() {
	        @Override
	        public idtext mapRow(ResultSet rs, int rowNum) throws SQLException {
	        	return new idtext(rs.getInt("ID"), rs.getString("NAME"));
			} 
	    };
	    
	    private static final RowMapper<idtext> MunicipalityMapper = new RowMapper<idtext>() {
	        @Override
	        public idtext mapRow(ResultSet rs, int rowNum) throws SQLException {
	        	return new idtext(rs.getInt("ID"), rs.getString("NAME_FI"));
			} 
	    };
	    
	    private static final RowMapper<rawModifiedResult> rawModifiedResultMapper = new RowMapper<rawModifiedResult>() {
	        @Override
	        public rawModifiedResult mapRow(ResultSet rs, int rowNum) throws SQLException {
	        	return new rawModifiedResult(rs.getString("MOD_DATE"), rs.getInt("ASSET_TYPE_ID"), rs.getString("NAME"), rs.getInt("MUNICIPALITYCODE"), rs.getString("NAME_FI"), rs.getInt("COUNT"));
			} 
	    };
	    
	    private static final RowMapper<String> modDateMapper = new RowMapper<String>() {
	        @Override
	        public String mapRow(ResultSet rs, int rowNum) throws SQLException { 
	            return rs.getString("MOD_DATE"); 

			} 
	    };
	    
	    @Deprecated
	    private static final RowMapper<ServiceUser> serviceUserMapper = new RowMapper<ServiceUser>() {
	        @Override
	        public ServiceUser mapRow(ResultSet rs, int rowNum) throws SQLException {
	        	return new ServiceUser(rs.getString("USERNAME"), rs.getString("CONFIGURATION"));
			} 
	    };
	    
	    private static final RowMapper<jqGridJsonTypeRow> serviceRowMapper = new RowMapper<jqGridJsonTypeRow>() {
	        @Override
	        public jqGridJsonTypeRow mapRow(ResultSet rs, int rowNum) throws SQLException {
	        	return new jqGridJsonTypeRow(String.valueOf(rowNum), Arrays.asList(rs.getString("USERNAME"), rs.getString("CONFIGURATION")));
//	        	return new ServiceUser();
			} 
	    };

}
