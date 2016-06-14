package dim.livi.digiroad.reporttool;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dim.livi.digiroad.NisRepository;
import dim.livi.digiroad.Utilities;

@RestController
public class ValidationController {
	
	@Autowired 
	private NisRepository items;

	@RequestMapping("/validate")
	public Integer validate(@RequestParam int id) {
		
		Integer[] typelist = new Integer[]{1,3};
		return items.getValidityManoeuvreCount(typelist, Utilities.sql.IN.toString());
	}
}
