import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 * This program takes dates from the infobox property file that are in the form <http://dbpedia.org/property/date>
 * "-100"^^int... and returns them in their correct RDF representation.
 */



public class yearParser {
	public static void createDate(String pathname) throws IOException{
		File file = new File(pathname);
		BufferedReader bufRdr = new BufferedReader(new FileReader(file));
		String line;
		while((line = bufRdr.readLine()) != null)
			if(line.contains("<http://dbpedia.org/property/date>")){
				if(line.contains("^^<http://www.w3.org/2001/XMLSchema#int>")){
					String date = line.substring((line.indexOf("/date>")+8), line.indexOf('^')-1);
					String name = line.substring(line.indexOf('<'),(line.indexOf('>')+1));
					if(date.length()==3){
						date = "0".concat(date);
					}
					if(date.length()==2)
						date = "00".concat(date);
					System.out.println(name+" <http://dbpedia.org/ontology/date> \""+date+"\"^^<http://www.w3.org/2001/XMLSchema#gYear>. ");
				}
			}
			
	}
	public static void main(String[] args) throws IOException{
		String pathname = "/Users/ewilson/Downloads/infobox_properties_en.nt";
		createDate(pathname);
	}
		
}
