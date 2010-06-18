package org.heml.Moffatt;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.StringTokenizer;

public class CsvToRdfAuthor {
/**
 * Used to read in a CSV file and store it into a 2-dimensional array
 * 
 * @param rows - number or rows in the file to be parsed
 * @param cols - number of columns in the file to be parsed
 * @param pathname - pathname to the file to be parsed
 * 
 * @return a 2-D matrix representation of the CSV file
 * @throws IOException
 */
	public static String[][] parseFile(int rows, int cols, String pathname) throws IOException{
		//Create array to store data
		String [][] numbers = new String [rows][cols];
		File file = new File(pathname);
		BufferedReader bufRdr = new BufferedReader(new FileReader(file));
		String line = null;
		int row = 0;
		int col = 0;
		//read each line of text file
		while((line = bufRdr.readLine()) != null && row < rows){
			/*
			 * String Tokenizer reads data into the array and does not include empty strings, thus columns are 
			 * not aligned properly, so the following replaces each ",," in a line with ",-," so it is put
			 * in array cell an as - (Thus you know a property in empty if the cell contains "-").
			 */
			line = line.replace(",,", ",-,");
			line = line.replace(",,", ",-,");
			StringTokenizer st = new StringTokenizer(line,",");
			
			while (st.hasMoreTokens())
			{
				//get next token and store it in the array
				numbers[row][col] = st.nextToken();
				col++;
			}
			col = 0;
			row++;
		}
		return numbers;
	}
/**
 * Parses a CSV file and produces an RDF file from the given values.  The user must supply the dimensions 
 * of the spread sheet that is being parsed as well as the file path to the CSV file.
 * 
 * @param args
 * @throws IOException
 */

	public static void main(String[] args) throws IOException{
		//these variables must be specified depending on the spreadsheet
		int numcols=10; // Number of columns
		String pathname = "/Users/ewilson/Documents/Halcyon-1.csv"; // path to file
		
		int numrows=0;
		File file = new File(pathname);
		BufferedReader bufRdr = new BufferedReader(new FileReader(file));
		//find the number of lines in the file and set it equal to numrows
		while(bufRdr.readLine() != null){
			numrows++;
		}
		
		String data[][] = new String[numrows][numcols];
		String first = null, end = null; // variables to represent beginning and end of tlg number
		//Default if there is no provided Preferred language
		String lang = "Not Specified";
		String authors[] = new String[numrows];
		Boolean newauthor = true;

		data = parseFile(numrows, numcols, pathname);// parse csv into a 2d array
		//Print out the header data in the file
		System.out.println("@prefix heml_cidoc_texts: <http://heml.mta.ca/cidoc_crm_texts#> .");
		System.out.println("@prefix crm: <http://cidoc.ics.forth.gr/rdfs/cidoc_v4.2.rdfs#> .");
		System.out.println("@prefix dbpedia: <http://dbpedia.org/resource/> .");
		System.out.println("@prefix heml_text: <http://heml.mta.ca/text/urn/> .");
		System.out.println("@prefix owl: <http://www.w3.org/2002/07/owl#> .");
		System.out.println("@prefix xsd: <http://www.w3.org/2001/XMLSchema#>");
		System.out.println();
		System.out.println("dbpedia:Ancient_greek a crm:E56 .");
		System.out.println("dbpedia:English_language a crm:E56 .");
		System.out.println();
		
		// code to print <http://heml.mta.ca/text/urn/tlg0003/tlg001> a crm:E33 .
		for(int i = 1; i<numrows; i++) // i = 1, start on the second line since the first one will be titles
		{
			if(data[i][0] != null){
				//break the tlg numbers into two different numbers
				first = data[i][0].substring(0, 7);
				authors[i] = first;
				for(int k = 1; k<i; k++)
				{
					if (authors[k].equals(authors[i])){
						newauthor=false;
					}
						
				}
				if(data[i][0].length()> 8)
				{
					end = data[i][0].substring(8,14);
					System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> a crm:E33 .");
				}
			}
			//code to print <http://heml.mta.ca/text/urn/tlg0003/tlg001> crm:P72F dbpedia:Ancient_greek.
			if(data[i][0] != null){
				first = data[i][0].substring(0, 7);
				if(data[i][0].substring(0, 3).equals("tlg"))
					lang = "dbpedia:Ancient_greek";
				if(data[i][0].substring(0,3).equals("lat"))
					lang = "dbpedia:Latin";
				if(data[i][0].length()> 8)
				{
					end = data[i][0].substring(8,14);
					System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> crm:P72F "+lang+" .");
				}
			}
			// code to print <http://heml.mta.ca/text/urn/tlg003/tlg001> crm:P73 <http://heml.mta.ca/text/urn/tlg0003/tlg001en>.
			if(data[i][0] != null && data[i][0].length()>8){
				System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> crm:P73 <http://heml.mta.ca/text/urn/"+ first+"/"+end+"en> .");
				//code to print <http://heml.mta.ca/text/urn/tlg0003/tlg001en> crm:P72F dbpedia:English_language.		
				System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"en> crm:P72F dbpedia:English_language .");
			}
			if(data[i][0]!=null){
				//code to print <http://heml.mta.ca/text/urn/tlg0003> owl:sameAs dbpedia:Thucydides.
				if(newauthor){// checks to make sure author hasn't already been printed
					//If author field contains "(" symbol
					if(data[i][3].contains("(")){
						System.out.println("<http://heml.mta.ca/text/urn/"+first+"> owl:sameAs <http://dbpedia.org/resource/"+data[i][3].substring(0,data[i][3].indexOf('('))+ "%28"+data[i][3].substring((data[i][3].indexOf('(')+1),data[i][3].indexOf(')'))+data[i][3].substring((data[i][3].indexOf(')'))+1)+"%29> .");
					}
					else{
						System.out.println("<http://heml.mta.ca/text/urn/"+first+"> owl:sameAs dbpedia:"+data[i][3]+" .");
					}
					//code to print <http://heml.mta.ca/text/urn/tlg0003> a crm:E39.
					System.out.println("<http://heml.mta.ca/text/urn/"+first+"> a crm:E39 .");
				}
				newauthor = true;
				//code to print <http://heml.mta.ca/text/urn/tlg0003/tlg001> owl:sameAs dbpedia:Peloponnesian_War.
				if(data[i][1]!=null && !data[i][1].equals("-") && data[i][0].length()>8){
					//If work contains "#" or "(" symbol print out entire URL.
					if(data[i][1].contains("(")){
						System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> owl:sameAs <http://dbpedia.org/resource/"+data[i][1].substring(0,data[i][1].indexOf('('))+ "%28"+data[i][1].substring((data[i][1].indexOf('(')+1),data[i][1].indexOf(')'))+data[i][1].substring((data[i][1].indexOf(')'))+1)+"%29> .");
					}
					else if(data[i][1].contains("#"))
					{
						System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> owl:sameAs <http://dbpedia.org/resource/"+data[i][1]+"> .");
					}
					else{
						System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> owl:sameAs dbpedia:"+data[i][1]+" .");
					}
					
				}
			}
			//code to print heml_cidoc_texts:creation_of_tlg0003_tlg_0001 a crm:E65 .
			if(data[i][0] != null && data[i][0].length()>8){
				System.out.println("heml_cidoc_texts:creation_of_"+first+"_"+end.substring(0,3)+"_"+end.substring(3)+" a crm:E65 .");
				//code to print heml_cidoc_texts:creation_of_tlg0003_tlg_0001 crm:P14 <http://heml.mta.ca/text/urn/tlg0003>.
				System.out.println("heml_cidoc_texts:creation_of_"+first+"_"+end.substring(0,3)+"_"+end.substring(3)+" crm:P14 <http://heml.mta.ca/text/urn/"+first+"> .");
				//code to print heml_cidoc_texts:creation_of_tlg0003_tlg_0001 crm:P94 <http://heml.mta.ca/text/urn/tlg0003/tlg001>.
				System.out.println("heml_cidoc_texts:creation_of_"+first+"_"+end.substring(0,3)+"_"+end.substring(3)+" crm:P94 <http://heml.mta.ca/text/urn/"+first+"/"+end+"> .");
			}
			
			//Code to print the perseus stuff
			if(data[i][4] != null && !data[i][4].equals("-")){
				System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> heml_cidoc_text:PerseusText \""+data[i][4]+"\"^^xsd:string");
			}
			if(data[i][5]!=null && !data[i][5].equals("-")){
				System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"en> heml_cidoc_text:PerseusText \""+data[i][5]+"\"^^xsd:string");

			}
			if(data[i][7]!=null && !data[i][7].equals("-")){
					System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> heml_cidoc_text:firstChunk \""+data[i][7]+"\"^^xsd:string");
					if(data[i][8]!=null&&!data[i][8].equals("-")){
						System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> heml_cidoc_text:secondChunk \""+data[i][8]+"\"^^xsd:string");
						if(data[i][9]!=null&&!data[i][9].equals("-")){
							System.out.println("<http://heml.mta.ca/text/urn/"+first+"/"+end+"> heml_cidoc_text:thirdChunk \""+data[i][9]+"\"^^xsd:string");
						}
					}
				}
			
			System.out.println();
		}

	}

}
