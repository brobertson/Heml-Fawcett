import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
/**
 * The timebound.java program produces output that is not all data, so this program takes that output and 
 * returns only the RDF data.
 */

public class fixRDF {

	public static void main(String[] args) throws IOException{
		String pathname = "/Users/ewilson/TimeBounds/src/dataFiles/timeBoundData.nt";
		File file = new File(pathname);
		BufferedReader bufRdr = new BufferedReader(new FileReader(file));
		String line;
		while((line = bufRdr.readLine()) != null)
			if(line.contains("<http://www.w3.org/2001/XMLSchema#long>")){
					System.out.println(line);
				}
			}
			

}
