package dim.livi.digiroad;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

public class MiddleLayer {
	
	public c3jsData buildC3JsChartData(List<String> modDates, List<String> kombinaatiot, ArrayList<rawModifiedResult> rawData) {
		c3jsData chartData = new c3jsData();
		List<String> headerList = new ArrayList<String>();
		List<String> hidesList = new ArrayList<String>();
		headerList.add("x");
		headerList.addAll(modDates);
		String[] header = headerList.toArray(new String[0]);
		String[][] cols = new String[1 + kombinaatiot.size()][headerList.size()];
		cols[0] = header;
		Map<String,String> names = new HashMap<String,String>();
		int i = 1;
		ListIterator<String> kombiterator = kombinaatiot.listIterator();
		while (kombiterator.hasNext()) {
			List<String> valueList = new ArrayList<String>();
			String item = kombiterator.next();
			valueList.add(item);
			ListIterator<String> modDiterator = modDates.listIterator();
			while (modDiterator.hasNext()) {		
				String mdate = modDiterator.next();
				ListIterator<rawModifiedResult> rditerator = rawData.listIterator();
				while (rditerator.hasNext()) {					
					rawModifiedResult rditem = rditerator.next();
					if (mdate.equals(rditem.getMod_Date()) && item.split("-")[0].equals(rditem.getMunicipalityCode().toString()) && item.split("-")[1].equals(rditem.getAsset_Type_Id().toString())) {
							valueList.add(rditem.getCount().toString());
							names.put(item, rditem.getMunicipality() + " " + rditem.getAsset_type());
							break;
						} else if (!rditerator.hasNext()) {
							valueList.add("0");
						}
				}
			}
//			if (this.checkIfAllZeros(valueList)) hidesList.add(item);
//			cols[i] = valueList.toArray(new String[0]);
			if (!this.checkIfAllZeros(valueList)) {
				cols[i] = valueList.toArray(new String[0]);
				i++;
			}	
		}
		
		chartData.setColumns(Arrays.copyOf(cols, i));
		chartData.setNames(names);
//		chartData.setHides(hidesList.toArray(new String[0]));
		return chartData;
	}
	
	public List<String> createArrayCombinations(String kunnat, String tietolajit) {
		List<String> kombinaatiot = new ArrayList<String>();
		List<String> kunnatList = Arrays.asList(kunnat.split("\\s*,\\s*"));
		List<String> tietolajitList = Arrays.asList(tietolajit.split("\\s*,\\s*"));
		for (String kunta : kunnatList) {
			for (String tietolaji : tietolajitList) {
				kombinaatiot.add(kunta + "-" + tietolaji);
			}
		}
		return kombinaatiot;
	}
	
	public String[][] createGroups(String kunnat, String tietolajit) {
		List<String> kunnatList = Arrays.asList(kunnat.split("\\s*,\\s*"));
		List<String> tietolajitList = Arrays.asList(tietolajit.split("\\s*,\\s*"));
		String[][] groups = new String[kunnatList.size()][tietolajitList.size()];
		int i = 0;
		for (String kunta : kunnatList) {
			int j = 0;
			for (String tietolaji : tietolajitList) {
				groups[i][j] = kunta + "-" + tietolaji;
				j++;
			}
			i++;
		}
		return groups;
	}
	
	private boolean checkIfAllZeros(List<String> valueList) {
		ListIterator<String> valiterator = valueList.listIterator();
		while (valiterator.hasNext()) {
			boolean hasPrevious = valiterator.hasPrevious();
			String val = valiterator.next();
			if (hasPrevious && !"0".equals(val)) return false;
		}
		return true;
	}

}
