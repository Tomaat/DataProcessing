# convertCSVJSON.py
# Dataprocessing pset 5
# Lysanne van Beek
# 10544259
# 
# Source: http://www.andymboyle.com/2011/11/02/quick-csv-to-json-parser-in-python/

import csv  
import json  

# Open file and read in fieldnames
f = open('happiness_data.csv', 'rU')  
reader = csv.DictReader(f, fieldnames = ("Country","Score"), delimiter=';')  

# Parse the CSV into JSON  
out = json.dumps([row for row in reader ])  
print "JSON parsed!"  

# Save the JSON  
f = open( 'happiness_data', 'w')  
f.write(out)  
print "JSON saved!"