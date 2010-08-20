import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;

/**
* A program to take all lines with the property date and "Battle_of" in their title and 
* manually ask you for to type in the year in which the date is referring to.  It takes that
* date and outputs it into a file in the correct date gyear format. 
*/

public class ManuallyFix {
	public static void parseData(String pathname) throws IOException{
		File file = new File(pathname);
		BufferedReader bufRdr = new BufferedReader(new FileReader(file));
		String line, name;
	
		while((line = bufRdr.readLine()) != null){
			if(line.contains("<http://dbpedia.org/property/date>")&&line.contains("@en")&&(line.contains("Battle_of"))){
				System.out.println(line);
				BufferedReader in =
				new BufferedReader(new InputStreamReader(System.in));
				String date = null;
				try {
					date = in.readLine();
				} catch (IOException e) {
				// TODO Auto-generated catch block
					e.printStackTrace();
				}
			
			name = line.substring(line.indexOf('<'),(line.indexOf('>')+1));
			
			if(!date.equals("")){
				try { BufferedWriter out = new BufferedWriter(new FileWriter("modifiedDates2.nt", true)); 
				out.write(name+ " <http://dbpedia.org/ontology/date> \""+date+"\"^^<http://www.w3.org/2001/XMLSchema#gYear>. \n"); 	
				out.close(); } 
				catch (IOException e) { } 
				
				}
			}	
		}
	}
	
	
	public static void main(String[] args) throws IOException{
		String pathname = "/Users/ewilson/Downloads/infobox_properties_en.nt";
		parseData(pathname);
	
	}
		
}
