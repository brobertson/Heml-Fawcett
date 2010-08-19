import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.regex.*;
/**
 * A program to parse date that are in the form <http://dbpedia.org/property/date><http://dbpedia.org/resource/date/106_BC>
 * This program returns their proper RDF representation. 
 */


public class InfoParser1 {
	
	public static void createInfo(String pathname) throws IOException{
		File file = new File(pathname);
		BufferedReader bufRdr = new BufferedReader(new FileReader(file));
		String line;

		while((line = bufRdr.readLine()) != null)
			if(line.contains("<http://dbpedia.org/property/date> <http://dbpedia.org/resource")){
				if(line.contains("_BC")){
					String date = line.substring((line.lastIndexOf("resource")+9), line.lastIndexOf('_'));
					// make sure date is a number
					if(date.matches("[0123456789]{1,4}")){
						String name = line.substring(line.indexOf('<'),(line.indexOf('>')+1));
						if(date.length()==4){
							date = "-".concat(date);
						}
						if(date.length()==3){
							date="-0".concat(date);
						}
						if(date.length()==2){
							date = "-00".concat(date);
						}
						if(date.length()==1){
							date="-000".concat(date);
						}
						System.out.println(name+" <http://dbpedia.org/ontology/date> \""+date+"\"^^<http://www.w3.org/2001/XMLSchema#gYear> .");
					}
				}
				else{
					String date = line.substring((line.lastIndexOf("resource")+9), line.lastIndexOf('>'));
					// make sure date is a number
					if(date.matches("[0123456789]{1,4}")){ 
					String name = line.substring(line.indexOf('<'),(line.indexOf('>')+1));
				
					if(date.length()==3){
						date="0".concat(date);
					}
					if(date.length()==2){
						date = "00".concat(date);
					}
					if(date.length()==1){
						date="000".concat(date);
					}
					System.out.println(name+" <http://dbpedia.org/ontology/date> \""+date+"\"^^<http://www.w3.org/2001/XMLSchema#gYear> .");
					}
					
				}
			}
			
	}
	public static void main(String[] args) throws IOException{
		String pathname = "/Users/ewilson/Downloads/infobox_properties_en.nt";
		createInfo(pathname);
	}
}
