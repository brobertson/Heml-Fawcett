import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import org.heml.chronology.parse.Date;
import org.heml.chronology.parse.DateTime;
import org.heml.chronology.parse.Year;


public class TimeBounds {
	
	
	private final static boolean debug = false;
	
	
	
	
	/**
		 * @param value The string to parse as a time
		 * @param datatype The datatype URI of which we believe <code>time</code> is
		 * a memember.
		 * @return The earliest time (in milliseconds) in <code>time</code>'s
		 * interval.
		 */
		public static Long getEarliestTime(String value, String dataType){
			Long earliest;
	
			//maybe we'll catch it on the else
			if (dataType == null ) dataType = "";
	
			if (dataType.equals("http://www.w3.org/2001/XMLSchema#gYear")) {
				try {
					Year yearParser = new Year();
					return new Long(yearParser.getEarliestTime(value));
				} catch (Exception e) {
					if (debug) System.err.println("Failed parsing #gYear: '" + value + "': "+e+"\nNo triples added");
					return null;
				}
			}
			else if (dataType.equals("http://www.w3.org/2001/XMLSchema#date")) {
				try {
					return new Long(Date.getEarliestTime(value));
				} catch (Exception e) {
					if (debug) System.err.println("Failed parsing #date: '" + value + "': "+e+"\nNo triples added");
					return null;
				}
			}
			else if (dataType.equals("http://www.w3.org/2001/XMLSchema#dateTime")) {
				try{
					return new Long(DateTime.getEarliestTime(value));
				} catch (Exception e){
					if (debug) System.err.println("exception trying to parse #dateTime: '" + value + "': " + e);
					if (debug) System.err.println("out of despiration, we are going to append ':00' and reparse");
					try{
						return new Long(DateTime.getEarliestTime(value));
					} catch ( Exception e1 ){
						if (debug) System.err.println("Failed parsing #dateTime: '"+value+"': " + e1 +"\nNo triples added");
						return null;
					}
				}
			}
			else{ // we have no idea what datatype this is
				try {
					return new Long(DateTime.getEarliestTime(value));
				} catch (Exception e) {
					if (debug) System.err.println("Tried to parse '"+value+"' as datetime, but: " + e);
					try {
						if (debug) System.err.println ("appending ':00' and reparsing");
						return new Long(DateTime.getEarliestTime(value + ":00"));
					} catch (Exception e1) {
						if (debug) System.err.println("that failed, too: " + e1);
	
						try {
							return new Long(Date.getEarliestTime(value));
						} catch (Exception e2) {
							if (debug) System.err.println("Tried to parse '"+value+"' as date, but: " + e2);
							try {
								Year yearParser = new Year();
								return new Long(yearParser.getEarliestTime(value));
							} catch (Exception e3) {
								if (debug) System.err.println("Failed parsing date/time: '"+value+"': "+e3+"\nNo triples added");
								return null;
							}
						}
					}
				}
			}
		}
	
	
		/**
		 * @param time The string to parse as a time
		 * @param datatype The datatype URI of which we believe <code>time</code> is
		 * a memember.
		 * @return The latest time (in milliseconds) in <code>time</code>'s
		 * interval.
		 */
		public static Long getLatestTime(String value, String dataType){
			if (dataType.equals("http://www.w3.org/2001/XMLSchema#gYear")) {
				try {
					Year yearParser = new Year();
					return new Long(yearParser.getLatestTime(value));
				} catch (Exception e) {
					if (debug) System.err.println("Failed parsing #gYear: '" + value + "': "+e+"\nNo triples added");
					return null;
				}
			}
			else if (dataType.equals("http://www.w3.org/2001/XMLSchema#date")) {
				try {
					return new Long(Date.getLatestTime(value));
				} catch (Exception e) {
					if (debug) System.err.println("Failed parsing #date: '" + value + "': "+e+"\nNo triples added");
					return null;
				}
			}
			else if (dataType.equals("http://www.w3.org/2001/XMLSchema#dateTime")) {
				try{
					return new Long(DateTime.getLatestTime(value));
				} catch (Exception e){
					if (debug) System.err.println("exception trying to parse #dateTime: '" + value + "': " + e);
					if (debug) System.err.println("out of despiration, we are going to append ':00' and reparse");
					try{
						return new Long(DateTime.getLatestTime(value));
					} catch ( Exception e1 ){
						if (debug) System.err.println("Failed parsing #dateTime: '"+value+"': " + e1 +"\nNo triples added");
						return null;
					}
				}
			}
			else{ // we have no idea what datatype this is
				try {
					return new Long(DateTime.getLatestTime(value));
				} catch (Exception e) {
					if (debug) System.err.println("Tried to parse '"+value+"' as datetime, but: " + e);
					try {
						if (debug) System.err.println ("appending ':00' and reparsing");
						return new Long(DateTime.getLatestTime(value + ":00"));
					} catch (Exception e1) {
						if (debug) System.err.println("that failed, too: " + e1);
	
						try {
							return new Long(Date.getLatestTime(value));
						} catch (Exception e2) {
							if (debug) System.err.println("Tried to parse '"+value+"' as date, but: " + e2);
							try {
								Year yearParser = new Year();
								return new Long(yearParser.getLatestTime(value));
							} catch (Exception e3) {
								if (debug) System.err.println("Failed parsing date/time: '"+value+"': "+e3+"\nNo triples added");
								return null;
							}
						}
					}
				}
			}
		}
		/**
		 * @param pathname to the RDF file
		 * Takes an RDF file and searches for any triples with the property date. It takes those triples and
		 * creates a time bound for their dates and prints out the resulting RDF.
		 */
		
		public static void createData(String pathname) throws IOException{
			File file = new File(pathname);
			BufferedReader bufRdr = new BufferedReader(new FileReader(file));
			String line;
			while((line = bufRdr.readLine()) != null)
				if(line.contains("<http://dbpedia.org/ontology/date>")){
					String dataType = line.substring((line.indexOf('^')+3), line.lastIndexOf('>'));
					// the actual date value
					String stringVal = line.substring((line.indexOf('\"')+1), line.lastIndexOf('\"'));
					String subject = line.substring(line.indexOf('<'), line.indexOf('>')+1);
					Long earliestTime, latestTime;
					earliestTime = getEarliestTime(stringVal, dataType);
					latestTime = getLatestTime(stringVal, dataType);
					System.out.println(subject+" <http://www.heml.org/rdf/2003-09-17/heml#EarliestTime> \"" + earliestTime + "\"^^<http://www.w3.org/2001/XMLSchema#long>  .");
					System.out.println(subject+" <http://www.heml.org/rdf/2003-09-17/heml#LatestTime> \"" + latestTime + "\"^^<http://www.w3.org/2001/XMLSchema#long>  .");
				}
		}
		
		public static void main(String[] args) throws IOException{
			
			String pathname = "/Users/ewilson/TimeBounds/src/dataFiles/".concat(args[0]);
			createData(pathname);	
		}
	}


