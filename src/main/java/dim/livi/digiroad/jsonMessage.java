package dim.livi.digiroad;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class jsonMessage {
	
	private String status;
	private String message;
	
	
	public String createJsonMessage(String status, String message) {
		this.status = status;
		this.message = message;
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
	
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

}
