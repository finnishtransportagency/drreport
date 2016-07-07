package dim.livi.digiroad;

import java.util.List;

public class jqGridJsonType {
	
	private String total;
	private String page;
	private String records;
	private List<jqGridJsonTypeRow> rows;
	
	public jqGridJsonType(Integer total, Integer page, Integer records, List<jqGridJsonTypeRow> rows) {
		this.setTotal(total.toString());
		this.setPage(page.toString());
		this.setRecords(records.toString());
		this.setRows(rows);
	}
	
	public String getTotal() {
		return total;
	}

	public void setTotal(String total) {
		this.total = total;
	}

	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public String getRecords() {
		return records;
	}

	public void setRecords(String records) {
		this.records = records;
	}
	
	public List<jqGridJsonTypeRow> getRows() {
		return rows;
	}
	public void setRows(List<jqGridJsonTypeRow> rows) {
		this.rows = rows;
	}

}
