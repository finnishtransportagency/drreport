package dim.livi.digiroad.reporttool;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dim.livi.digiroad.NisRepository;

@RestController
public class HelloController {
	
	@Autowired 
	private NisRepository items;

	@RequestMapping("/hello")
	public String hello(@RequestParam String name) {
		
		
		return "Hello "+ name;
	}
}
