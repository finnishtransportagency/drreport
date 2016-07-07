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

import dim.livi.digiroad.NisRepository;
import dim.livi.digiroad.ServiceUser;
import dim.livi.digiroad.Utilities;
import dim.livi.digiroad.c3jsData;
import dim.livi.digiroad.idtext;
import dim.livi.digiroad.jqGridJsonType;
import dim.livi.digiroad.jqGridJsonTypeRow;
import dim.livi.digiroad.jsonMessage;
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
	
	@RequestMapping(value = "/koodistot/kayttajat", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<jqGridJsonType> kayttajat(@RequestParam Integer page, @RequestParam Integer rows, @RequestParam String sidx, @RequestParam String sord) {
		int userCount = items.getServiceUserCount();
		int pageCount = (int) Math.ceil((double) userCount / rows);
		return new ResponseEntity<jqGridJsonType>(new jqGridJsonType(pageCount, page, userCount, items.getServiceUsers(rows, page, sidx, sord)), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/raportit/graafi1/{startdate}/{stopdate}/{kunnat}/{tietolajit}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<c3jsData> chart1(@PathVariable String startdate, @PathVariable String stopdate, @PathVariable String kunnat, @PathVariable String tietolajit) throws InterruptedException, ExecutionException {
		MiddleLayer mid = new MiddleLayer();
//		c3jsData chartData = mid.buildC3JsChartData(items.getModDates(startdate, stopdate, kunnat, tietolajit),
//				mid.createArrayCombinations(kunnat, tietolajit), items.getRawModifiedResult(startdate, stopdate, kunnat, tietolajit));
		final Future<ArrayList<rawModifiedResult>> future = items.getRawModifiedResult(startdate, stopdate, kunnat, tietolajit);
		int startTime = ScheduleTask.getCurrentTimer();
		jsonMessage json = new jsonMessage();
//		SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create();
//		accessor.setContentType(MimeTypeUtils.TEXT_PLAIN);
//		accessor.setNativeHeader("foo", "bar");
//		accessor.setLeaveMutable(true);
//		MessageHeaders headers = accessor.getMessageHeaders();
//		Message<String> message1 = MessageBuilder.withPayload("test")
//		        .setHeader("foo", "bar")
//		        .build();
//		this.template.convertAndSend("/topic/message", "message1", headers);
		this.template.convertAndSend("/topic/message", json.createJsonMessage(Utilities.status.START.toString(), "Prosessoidaan"));
		while (!future.isDone()) {
//        	System.out.println("xx " + ScheduleTask.getCurrentTimer());
			Thread.sleep(500L);
			this.template.convertAndSend("/topic/message", json.createJsonMessage(Utilities.status.CONTINUE.toString(),"Haetaan tuloksia graafia varten, aikaa kulunut " + (ScheduleTask.getCurrentTimer() - startTime) + " s."));
			Thread.sleep(500L);
        }
		this.template.convertAndSend("/topic/message", json.createJsonMessage(Utilities.status.STOP.toString(), "Haku valmis, piirretään graafi."));
		c3jsData chartData = mid.buildC3JsChartData(items.getModDates(startdate, stopdate, kunnat, tietolajit),
				mid.createArrayCombinations(kunnat, tietolajit), future.get());
		chartData.setGroups(mid.createGroups(kunnat, tietolajit));
		return new ResponseEntity<c3jsData>(chartData, HttpStatus.OK);
	}
	
	@Autowired
	private MailSender mailSender;
	
	@Autowired
  private SimpMessagingTemplate template;
	
	@RequestMapping(value = "/testi", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<String> testi() throws InterruptedException, ExecutionException {

        final Future<Boolean> future = mailSender.sendMail();
        while (!future.isDone()) {
//        	System.out.println("xx " + ScheduleTask.getCurrentTimer());
        	Thread.sleep(1000L);
        }
        Boolean result = future.get();
		return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
	}
	
//	@RequestMapping(value = "/testi2", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
//	public ResponseEntity<jqGridJsonType> testi2(){
//		jqGridJsonType res = new jqGridJsonType("1", "2", "3");
//		List<jqGridJsonTypeRow> lista = new ArrayList<jqGridJsonTypeRow>();
//		jqGridJsonTypeRow item = new jqGridJsonTypeRow();
//		item.setId("22");
//		List<String> rivi = new ArrayList<String>();
//		rivi.add("user");
//		rivi.add("conf");
//		item.setCell(rivi);
//		lista.add(item);
//		res.setRows(lista);
//		return new ResponseEntity<jqGridJsonType>(res, HttpStatus.OK);
//	}
}

