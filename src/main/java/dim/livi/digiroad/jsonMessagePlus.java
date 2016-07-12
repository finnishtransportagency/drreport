package dim.livi.digiroad;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class jsonMessagePlus extends jsonMessage {
	
	private String id;
	
	
	public String createJsonMessage(String status, String message, String id) {
		this.status = status;
		this.message = message;
		this.setId(id);
		ObjectMapper mapper = new ObjectMapper();
		String jsonmessage = "failed";
		try {
			jsonmessage = mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return jsonmessage;
	}


	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}

}
