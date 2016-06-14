package dim.livi.digiroad.reporttool;

import java.util.List;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dim.livi.digiroad.NisRepository;
import dim.livi.digiroad.idtext;

@RestController
public class ReportController {
	
	@Autowired 
	private NisRepository items;

	@RequestMapping(value = "/report", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<List<idtext>> report(@RequestParam String q) {
		return new ResponseEntity<List<idtext>>(items.getAssetTypes(q), HttpStatus.OK);
	}
}

