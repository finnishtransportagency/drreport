package dim.livi.digiroad.reporttool;

import java.util.List;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dim.livi.digiroad.NisRepository;
import dim.livi.digiroad.c3jsData;
import dim.livi.digiroad.idtext;
import dim.livi.digiroad.rawModifiedResult;

import dim.livi.digiroad.MiddleLayer;

@RestController
public class ReportController {
	
	@Autowired 
	private NisRepository items;

	@RequestMapping(value = "/koodistot/tietolajit", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<List<idtext>> tietolajit(@RequestParam String q) {
		return new ResponseEntity<List<idtext>>(items.getAssetTypes(q), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/koodistot/kunnat", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<List<idtext>> kunnat(@RequestParam String q) {
		return new ResponseEntity<List<idtext>>(items.getMunicipalitys(q), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/raportit/graafi1/{startdate}/{stopdate}/{kunnat}/{tietolajit}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<c3jsData> chart1(@PathVariable String startdate, @PathVariable String stopdate, @PathVariable String kunnat, @PathVariable String tietolajit) {
		MiddleLayer mid = new MiddleLayer();
		c3jsData chartData = mid.buildC3JsChartData(items.getModDates(startdate, stopdate, kunnat, tietolajit),
				mid.createArrayCombinations(kunnat, tietolajit), items.getRawModifiedResult(startdate, stopdate, kunnat, tietolajit));
		chartData.setGroups(mid.createGroups(kunnat, tietolajit));
		return new ResponseEntity<c3jsData>(chartData, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/testi", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<c3jsData> testi() {
		c3jsData testi = new c3jsData();
		String[] a = { "x", "2013-01-01", "2013-01-02", "2013-01-03" };
		String[] b = { "data1", "3000", "2000", "1000" };
		String[] c = { "data2", "5100", "1000", "1900" };
		String[][] cols = {a, b, c};		
		testi.setColumns(cols);
		return new ResponseEntity<c3jsData>(testi, HttpStatus.OK);
	}
}

