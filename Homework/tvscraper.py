#from __future__ import division, absolute_import, print_function, unicode_literals
#!/usr/bin/env python
# Name: Lysanne van Beek
# Student number: 10544259
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import re

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    output_series = []
    
    # select information from each serie
    for series in dom.by_class('lister-item-content'):
        title = series.children[1].children[3].content
        rating = series.children[5].children[1].children[3].content
        genre = series.children[3].by_class("genre")[0].content
        actors = ', '.join([str(t.content.encode('latin-1','ignore')) for t in series.children[9].children if type(t) == type(series)])
        runtime = re.sub("\D", "", series.children[3].by_class("runtime")[0].content)
        
        # make a tuple containing information about the serie
        title, rating, genre, runtime = (str(i.encode('latin-1','ignore')).strip() for i in (title, rating, genre, runtime) )
        
        # add information to list with all output
        output_series.append( (title, rating, genre, actors, runtime) )

    return output_series


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['sep=,'])
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    
    for serie in tvseries:
        writer.writerow(serie)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)