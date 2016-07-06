package dim.livi.digiroad;

public class Utilities {
	
	public static enum sql {
		IN("in"), NOT_IN("not in");
		
		private String sqlClause = "";
		
		private sql(String value) {
			this.sqlClause = value;
		}
		
		@Override
        public String toString(){
            return sqlClause;
        } 
	}
	
	public static enum status { START("start"), STOP("stop"), CONTINUE("continue");
		
		private String status = "";
		
		private status(String value) {
			this.status = value;
		}
		
		@Override
        public String toString(){
            return status;
        } 
	}
}


