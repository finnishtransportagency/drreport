package dim.livi.digiroad;

public class rawModifiedResult {
	
	private String Mod_Date;
	private Integer Asset_Type_Id;
	private Integer MunicipalityCode;
	private Integer count;
	
	public rawModifiedResult(String mod_date, Integer asset_type_id, Integer municipalitycode, Integer count) {
		this.Mod_Date = mod_date;
		this.Asset_Type_Id = asset_type_id;
		this.MunicipalityCode = municipalitycode;
		this.count = count;
	}
	
	public String getMod_Date() {
		return Mod_Date;
	}
	public void setMod_Date(String mod_Date) {
		Mod_Date = mod_Date;
	}
	public Integer getAsset_Type_Id() {
		return Asset_Type_Id;
	}
	public void setAsset_Type_Id(Integer asset_Type_Id) {
		Asset_Type_Id = asset_Type_Id;
	}
	public Integer getMunicipalityCode() {
		return MunicipalityCode;
	}
	public void setMunicipalityCode(Integer municipalityCode) {
		MunicipalityCode = municipalityCode;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	
	

}
