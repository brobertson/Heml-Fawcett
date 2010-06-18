package org.heml.Moffatt;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.StringTokenizer;

public class CsvToRdfEvent {
	/**
	 * Reads in a CSV file and store it into a 2-dimensional array
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
			 * in array cell as an "-" (Thus you know a property in empty if the cell contains "-").
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
	 * Parses a CSV file and produces an RDF file from the given values.  The user must supply the 
	 * dimensions of the spread sheet that is being parsed as well as the file path to the CSV file.
	 * 
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws IOException {
		//these variables must be specified depending on the spreadsheet
		int numcols=6; // Number of columns 
		String pathname = "/Users/ewilson/Documents/testsheet.csv"; // Path to file
		
		int numrows=0;
		File file = new File(pathname);
		BufferedReader bufRdr = new BufferedReader(new FileReader(file));
		//find the number of lines in the file and set it equal to numrows
		while(bufRdr.readLine() != null){
			numrows++;
		}
		
		String data[][] = new String[numrows][numcols];
		String first, end; // variables to represent beginning and end of tlg number
		data = parseFile(numrows, numcols, pathname);// parse csv into a 2d array
		String evidence = "http://www.heml.org/rdf/2003-09-17/heml#Evidence";
		//Print out the header data in the file
		System.out.println("@prefix heml_cidoc_texts: <http://heml.mta.ca/cidoc_crm_texts#> .");
		System.out.println("@prefix crm: <http://cidoc.ics.forth.gr/rdfs/cidoc_v4.2.rdfs#> .");
		System.out.println("@prefix dbpedia: <http://dbpedia.org/resource/> .");
		System.out.println("@prefix heml_text: <http://heml.mta.ca/text/urn/> .");
		System.out.println("@prefix owl: <http://www.w3.org/2002/07/owl#> .");
		System.out.println();
		
		for(int i = 1; i< numrows; i++) // Start at second line since first line will be titles
		{	if(data[i][2] != null){
				//break the tlg numbers into two different numbers (from column 3)
				first = data[i][2].substring(0, 7);
				if(data[i][2].length()> 9)
				{
					end = data[i][2].substring(8);
					if(data[i][0].contains("(")){
						System.out.println("<http://dbpedia.org/resource/"+data[i][0].substring(0,data[i][0].indexOf('('))+"%28"+data[i][0].substring((data[i][0].indexOf('(')+1),data[i][0].indexOf(')'))+"%29> http://www.heml.org/rdf/2003-09-17/heml#Evidence <http://heml.mta.ca/text/urn/"+first+"/"+end+"> .");
					
					}// if "()" in name then print out entire URL
					else{
						System.out.println("dbpedia:"+data[i][0]+" "+evidence+" <http://heml.mta.ca/text/urn/"+first+"/"+end+"> .");
					}
				}
				
			}
		}
	}
}