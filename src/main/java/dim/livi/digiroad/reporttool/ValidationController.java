package dim.livi.digiroad.reporttool;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;

import dim.livi.digiroad.NisRepository;
import dim.livi.digiroad.ParamValue;
import dim.livi.digiroad.Utilities;
import dim.livi.digiroad.ValidationResult;
import dim.livi.digiroad.jqGridJsonType;
import dim.livi.digiroad.jqGridJsonTypeRow;
import dim.livi.digiroad.jsonMessagePlus;

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
		return new ResponseEntity<jqGridJsonType>(new jqGridJsonType(0, 0, 0, items.getValidationRules(0)), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/validate/test/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<List<String>> test(@PathVariable Integer id, HttpSession session) throws InterruptedException, ExecutionException {
		String sessionId = session.getId();
		final Future<List<String>> future = items.getSleep(id);
		int startTime = ScheduleTask.getCurrentTimer();
		jsonMessagePlus json = new jsonMessagePlus();
		this.template.convertAndSendToUser(sessionId, "/topic/testmessage", json.createJsonMessage(Utilities.status.START.toString(), "Prosessoidaan", id.toString()));
		while (!future.isDone()) {
			Thread.sleep(1000L);
			this.template.convertAndSendToUser(sessionId, "/topic/testmessage", json.createJsonMessage(Utilities.status.CONTINUE.toString(),"Haetaan tuloksia, aikaa kulunut " + (ScheduleTask.getCurrentTimer() - startTime) + " s.", id.toString()));
        }
		this.template.convertAndSendToUser(sessionId, "/topic/testmessage", json.createJsonMessage(Utilities.status.STOP.toString(), "Haku valmis.", id.toString()));
		return new ResponseEntity<List<String>>(future.get(), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/validate/result/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ValidationResult> result(@PathVariable Integer id, HttpSession session) throws InterruptedException, ExecutionException {
		String sessionId = session.getId();
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor
			    .create(SimpMessageType.MESSAGE);
//			headerAccessor.setSessionId(sessionId);
//			headerAccessor.setLeaveMutable(true);
			System.out.println(sessionId);
			System.out.println(headerAccessor.getSessionId());
		jqGridJsonTypeRow validationRule = items.getValidationRules(id).get(0);
		String type = null != validationRule.getCell().get(1) ? validationRule.getCell().get(1) : "undefined";
		String filter = null != validationRule.getCell().get(2) ? validationRule.getCell().get(2) : "=0";
		Integer Asset_type_id = Integer.parseInt(validationRule.getCell().get(5));
		if ("number".equals(type)) {
			final Future<List<ParamValue>> future = items.getValidationResult(Asset_type_id, filter);
			int startTime = ScheduleTask.getCurrentTimer();
			jsonMessagePlus json = new jsonMessagePlus();
			this.template.convertAndSendToUser(sessionId, "/queue/testmessage", json.createJsonMessage(Utilities.status.START.toString(), "Prosessoidaan", id.toString()), Collections.singletonMap(SimpMessageHeaderAccessor.SESSION_ID_HEADER, sessionId));
			while (!future.isDone()) {
				Thread.sleep(1000L);
				this.template.convertAndSend("/topic/testmessage", json.createJsonMessage(Utilities.status.CONTINUE.toString(),"Haetaan tuloksia, aikaa kulunut " + (ScheduleTask.getCurrentTimer() - startTime) + " s.", id.toString()));
	        }
			this.template.convertAndSend("/topic/testmessage", json.createJsonMessage(Utilities.status.STOP.toString(), "Haku valmis.", id.toString()));
			ValidationResult valRes = new ValidationResult("ok", id, future.get());
			return new ResponseEntity<ValidationResult>(valRes, HttpStatus.OK);
		} else {
			final Future<List<String>> future = items.getSleep(id);
			int startTime = ScheduleTask.getCurrentTimer();
			jsonMessagePlus json = new jsonMessagePlus();
			this.template.convertAndSendToUser(sessionId, "/topic/testmessage", json.createJsonMessage(Utilities.status.START.toString(), "Prosessoidaan (fake)", id.toString()));
			while (!future.isDone()) {
				Thread.sleep(1000L);
				this.template.convertAndSendToUser(sessionId, "/topic/testmessage", json.createJsonMessage(Utilities.status.CONTINUE.toString(),"Haetaan fake-tuloksia, aikaa kulunut " + (ScheduleTask.getCurrentTimer() - startTime) + " s.", id.toString()));
	        }
			this.template.convertAndSendToUser(sessionId, "/topic/testmessage", json.createJsonMessage(Utilities.status.STOP.toString(), "Fake-haku valmis.", id.toString()));
			@SuppressWarnings("serial")
			ValidationResult valRes = new ValidationResult("fail", id, (List<ParamValue>) new ArrayList<ParamValue>(){{add(new ParamValue("Fake", "007"));}});
			return new ResponseEntity<ValidationResult>(valRes, HttpStatus.OK);
		}
	}
	
	private MessageHeaders createHeaders(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }
}
