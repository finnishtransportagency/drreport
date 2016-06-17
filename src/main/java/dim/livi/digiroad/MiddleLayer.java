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
		headerList.add("x");
		headerList.addAll(modDates);
		String[] header = headerList.toArray(new String[0]);
		String[][] cols = new String[1 + kombinaatiot.size()][headerList.size()];
		cols[0] = header;
		Map<String,String> names = new HashMap<String,String>();
		int i = 1;
		for (String item : kombinaatiot) {
			List<String> valueList = new ArrayList<String>();
			valueList.add(item);
			for (String mdate : modDates) {
				ListIterator<rawModifiedResult> rditerator = rawData.listIterator();
				while (rditerator.hasNext()) {
					boolean addName = false;
					if (!rditerator.hasPrevious()) addName = true;
					rawModifiedResult rditem = rditerator.next();
					if (addName) names.put(item, rditem.getMunicipality() + " " + rditem.getAsset_type());
					if (mdate.equals(rditem.getMod_Date()) && item.split("-")[0].equals(rditem.getMunicipalityCode().toString()) && item.split("-")[1].equals(rditem.getAsset_Type_Id().toString())) {
							valueList.add(rditem.getCount().toString());
							break;
						} else if (!rditerator.hasNext()) {
							valueList.add("0");
						}
				}
			}
			cols[i] = valueList.toArray(new String[0]);
			i++;
		}		
		chartData.setColumns(cols);
		chartData.setNames(names);
		
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

}
