package dim.livi.digiroad;

public class ParamValue {
	
	private String param;
	private String value;
	
	public ParamValue(String param, String value) {
		this.param = param;
		this.value = value;
	}
	
	public String getParam() {
		return param;
	}
	public void setParam(String param) {
		this.param = param;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}

}
