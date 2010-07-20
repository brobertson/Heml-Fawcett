#!/bin/bash
REPOSITORY="foo"
FILES="/tmp/*nt
/Users/brobertson/Documents/Joseki/Joseki-3.4.1-TDB-Heml/Labels/labels/labels_ko.nt"

for f in $FILES
do
  echo "Processing `du -h $f`"
  time curl -\# -X POST --data-binary @$f -H Content-Type:text/rdf+n3 "http://localhost:8080/openrdf-sesame/repositories/$REPOSITORY/statements?context=%3Cfile://$f%3E"
  # take action on each file. $f store current file name
 # cat $f
done
echo "Done"