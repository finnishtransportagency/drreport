package dim.livi.digiroad;

public class idtext {
	private Integer id;
	private String text;
	public idtext(Integer id, String text) {
		this.setId(id);
		this.setText(text);
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
}
