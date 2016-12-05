# JSON_maker.py
# Dataprocessing pset 3
# Lysanne van Beek
# 10544259
# 
# Source: http://www.andymboyle.com/2011/11/02/quick-csv-to-json-parser-in-python/

import csv  
import json  
  
# Open file and read in fieldnames
f = open( 'data_hupsel.csv', 'rU' )  
reader = csv.DictReader( f, fieldnames = ( "Date","Amount_of_sunshine"), delimiter=',')  

# Parse the CSV into JSON  
out = json.dumps( [ row for row in reader ] )  
print "JSON parsed!"  

# Save the JSON  
f = open( 'data_hupsel.json', 'w')  
f.write(out)  
print "JSON saved!"