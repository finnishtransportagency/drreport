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
}


