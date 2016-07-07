package dim.livi.digiroad;

import java.util.List;

public class jqGridJsonTypeRow {
	
	private String id;
	private List<String> cell;
	
	public jqGridJsonTypeRow(String id, List<String> cell) {
		this.id = id;
		this.cell = cell;
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public List<String> getCell() {
		return cell;
	}
	public void setCell(List<String> cell) {
		this.cell = cell;
	}

}
