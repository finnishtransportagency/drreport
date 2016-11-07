package dim.livi.digiroad;

import java.util.Map;

public class c3jsData {
	
	private String[][] columns_cumul;
	private String[][] columns_cumul_rel;
	private String[][] columns;
	private String[][] columns_rel;
	private String[][] groups;
	private Map<?, ?> names;
	
	public String[][] getColumnsCumul() {
		return columns_cumul;
	}
	public void setColumnsCumul(String[][] columns) {
		this.columns_cumul = columns;
	}
	public String[][] getColumnsCumulRel() {
		return columns_cumul_rel;
	}
	public void setColumnsCumulRel(String[][] columns) {
		this.columns_cumul_rel = columns;
	}
	public String[][] getColumns() {
		return columns;
	}
	public void setColumns(String[][] columns) {
		this.columns = columns;
	}
	public String[][] getColumnsRel() {
		return columns_rel;
	}
	public void setColumnsRel(String[][] columns) {
		this.columns_rel = columns;
	}
	public String[][] getGroups() {
		return groups;
	}
	public void setGroups(String[][] groups) {
		this.groups = groups;
	}
	public Map<?, ?> getNames() {
		return names;
	}
	public void setNames(Map<?, ?> names) {
		this.names = names;
	}
}
