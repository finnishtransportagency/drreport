package dim.livi.digiroad;

public class ServiceUser {
	private String Username;
	private String Configuration;
	
	public ServiceUser(String username, String configuration) {
		this.Username = username;
		this.Configuration = configuration;
	}
	
	public String getUsername() {
		return Username;
	}
	public void setUsername(String username) {
		Username = username;
	}
	public String getConfiguration() {
		return Configuration;
	}
	public void setConfiguration(String configuration) {
		Configuration = configuration;
	}

}
