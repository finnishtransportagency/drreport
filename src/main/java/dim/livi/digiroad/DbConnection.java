package dim.livi.digiroad;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class DbConnection {
	private String jndiName = "jdbc/tml";
	private DataSource ds;
	private Context ctx;

	/**
	 * Description here.
	 */
	public DbConnection() {}

	/**
	 * Description here.
	 * @return
	 */
	public Connection connect() {
		Connection conn = null;
		try {
			if (this.ctx == null) {
				this.ctx = new InitialContext();
			}
			if (this.ds == null) {
				this.ds = (DataSource)this.ctx.lookup("java:comp/env/" + this.jndiName);
			}
			if (this.ds != null) {
				conn = this.ds.getConnection();
			}
		} catch (NamingException ne) {
			//catch NamingException - should be written to log file.
		} catch (SQLException sqle) {
			//catch SQLException - should be written to log file.
		} catch (Exception e) {
			//Should not be used. Instead use specific exceptions (see example above)
			System.err.println("Db connect():" + e);
		}
		return conn;		
	}

	/**
	 * Description here.
	 * @param conn
	 * @param pst
	 * @param rs
	 */
	public void closeObjects(final Connection conn, final PreparedStatement pst, final ResultSet rs) {
		try {
			if (rs != null) {
				rs.close();
			}
			if (pst != null) {
				pst.close();
			}
			if (conn != null) {
				conn.close();
			}
		} catch (SQLException sqle) {
			//catch SQLException - should be written to log file.
		} catch (Exception e) {
			//Should not be used. Instead use specific exceptions (see example above)
		}
	}
	
	/**
	 * Description here.
	 * @param conn
	 * @param pst
	 * @param rs
	 */
	public void closeObjectsSt(final Connection conn, final Statement st, final ResultSet rs) {
		try {
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			if (conn != null) {
				conn.close();
			}
		} catch (SQLException sqle) {
			//catch SQLException - should be written to log file.
		} catch (Exception e) {
			//Should not be used. Instead use specific exceptions (see example above)
		}
	}
	
	

}
