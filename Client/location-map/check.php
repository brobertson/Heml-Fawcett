<?php 

$uri = $_GET["uri"];
$info = @parse_url($uri);

$fp = @fsockopen($info["host"], 80, $errno, $errstr, 10); 
if(!$fp) {
	echo "BAD";
} else {
    
    // Checks the path is not empty
    if( empty( $info["path"] ) ) {
        // If it is empty it fills it
        $info["path"] = "/";
    }
    $query = "";

    // Checks if there is a query string in the url
    if( isset( $info["query"] ) ) {
        // If there is a query string it adds a ? to the front of it
        $query = "?".$info["query"]."";
    }

    // Sets the headers to send
    $out  = "GET ".$info["path"]."".$query." HTTP/1.0\r\n";
    $out .= "Host: ".$info["host"]."\r\n";
    $out .= "Connection: close \r\n";
    $out .= "User-Agent: link_checker/1.1\r\n\r\n";

    // writes the headers out
    fwrite( $fp,  $out );
    $html = '';

    // Reads what gets sent back
    while ( !feof( $fp ) ) {
        $html .= fread( $fp,  8192 );
    }

    // Closes socket
    fclose($fp);
    
    // Splits the headers into an array
    $headers = explode( "\r\n",  $html );
    unset( $html );
    for( $i=0;isset( $headers[$i] );$i++ ) {
        // Checks if the header is the status header
        if( preg_match( "/HTTP\/[0-9A-Za-z +]/i" , $headers[$i] ) ) {
          // If it is save the status
          $status = preg_replace( "/http\/[0-9]\.[0-9]/i", "", $headers[$i] );
        }
    }
    if (preg_match('/4[0-9][0-9]/',$status)) {
        echo "BAD";
    } else {
	    echo "GOOD";
	}
} 

?>
