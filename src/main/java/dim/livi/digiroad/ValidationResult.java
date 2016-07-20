package dim.livi.digiroad;

import java.util.List;

public class ValidationResult {
	
	private String status;
	private Integer rowid;
	private List<ParamValue> params;
	
	public ValidationResult(String status, Integer rowid, List<ParamValue> params) {
		this.status = status;
		this.rowid = rowid;
		this.params = params;
	}
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Integer getRowid() {
		return rowid;
	}
	public void setRowid(Integer rowid) {
		this.rowid = rowid;
	}
	public List<ParamValue> getParams() {
		return params;
	}
	public void setParams(List<ParamValue> params) {
		this.params = params;
	}

}
