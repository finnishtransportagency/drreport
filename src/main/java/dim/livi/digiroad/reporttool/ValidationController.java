package dim.livi.digiroad.reporttool;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dim.livi.digiroad.MiddleLayer;
import dim.livi.digiroad.NisRepository;
import dim.livi.digiroad.Utilities;
import dim.livi.digiroad.c3jsData;
import dim.livi.digiroad.jqGridJsonType;
import dim.livi.digiroad.jsonMessage;
import dim.livi.digiroad.jsonMessagePlus;
import dim.livi.digiroad.rawModifiedResult;

@RestController
public class ValidationController {
	
	@Autowired 
	private NisRepository items;
	
	@Autowired
	private SimpMessagingTemplate template;

	@RequestMapping("/validate")
	public Integer validate(@RequestParam int id) {
		
		Integer[] typelist = new Integer[]{1,3};
		return items.getValidityManoeuvreCount(typelist, Utilities.sql.IN.toString());
	}
	
	@RequestMapping("/validate/rules")
	public ResponseEntity<jqGridJsonType> getValidationRules() {
		return new ResponseEntity<jqGridJsonType>(new jqGridJsonType(0, 0, 0, items.getValidationRules()), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/validate/test/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<List<String>> test(@PathVariable Integer id) throws InterruptedException, ExecutionException {
		final Future<List<String>> future = items.getSleep(id);
		int startTime = ScheduleTask.getCurrentTimer();
		jsonMessagePlus json = new jsonMessagePlus();
		this.template.convertAndSend("/topic/testmessage", json.createJsonMessage(Utilities.status.START.toString(), "Prosessoidaan", id.toString()));
		while (!future.isDone()) {
			Thread.sleep(1000L);
			this.template.convertAndSend("/topic/testmessage", json.createJsonMessage(Utilities.status.CONTINUE.toString(),"Haetaan tuloksia, aikaa kulunut " + (ScheduleTask.getCurrentTimer() - startTime) + " s.", id.toString()));
        }
		this.template.convertAndSend("/topic/testmessage", json.createJsonMessage(Utilities.status.STOP.toString(), "Haku valmis.", id.toString()));
		return new ResponseEntity<List<String>>(future.get(), HttpStatus.OK);
	}
}
