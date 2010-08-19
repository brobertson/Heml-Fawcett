import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class FixDoubles {
	/**
	 * Takes the data files and checks to see if there are any doubles, triples, and so on, in the file that have the same subject, if so
	 * it only prints out the first of those. 
	 *
	 */

	public static void FixD(String pathname) throws IOException{
		File file = new File(pathname);
		BufferedReader bufRdr = new BufferedReader(new FileReader(file));
		String line, line2;
		String name = null, name2;
		Boolean flag = true; 
		Boolean flag2 = true;
		line=bufRdr.readLine();
		//While readLine doesn't return null
		while(flag2){
			if(line==null){
				flag2 = false;
			}
			if(line!=null){
				if(line.contains("<")){
					name = line.substring(line.indexOf('<'),(line.indexOf('>')+1));
					System.out.println(line);
					flag=true;
					while(flag){
						line2=bufRdr.readLine();
						if(line2==null){
							flag2 = false;
							flag=false;
						}
						if(flag2!=false){
							name2=line2.substring(line2.indexOf('<'),(line2.indexOf('>')+1));
							if(!name.equals(name2)){
								flag = false;
								line = line2;
							}
						}
					}
				}
			}
		}
	}
	
	public static void main(String[] args) throws IOException{
		String pathname ;
		pathname = "/Users/ewilson/TimeBounds/src/dataFiles/dateData.nt";
		FixD(pathname);
		pathname = "/Users/ewilson/TimeBounds/src/dataFiles/dateData2.nt";
		FixD(pathname);
	}
}
