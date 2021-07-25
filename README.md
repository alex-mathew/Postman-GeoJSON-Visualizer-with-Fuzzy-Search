# Postman-GeoJSON-Visualizer-with-Fuzzy-Search
This is an entry for the "Visualize for the Prize" Hackathon conducted as part of the Postman Student Summit 2021. GeoJSON response is visualized as an interactive map built with a base map of choice and spatial data points grouped into layers. It supports fuzzy search on values of non-spatial attributes.
<br><br>Watch the visualizer in action: https://youtu.be/YOi3eB-cMVc

## Inspiration
The idea for this visualization came from my GSoC’20 stint with OSGeo where I contributed to pygeoapi - a python RESTful OGC API framework for handling spatial data. A lot of my time was spent on validating API responses using Postman. Spatial data is something that needs to be visualized in a map to make sense. So whenever I had a response that needed to be validated, I had to copy-paste the GeoJSON response from Postman to some other tool providing visualization. If I was aware of the visualization feature in Postman back then, it could have saved me a lot of time and effort. So when I read about the visualization feature and this hackathon from the postman newsletter, the first thing that came to my mind was creating a visualization for GeoJSON data.

## What it does
[Targeted Conservation Sites in India](https://api.maptiler.com/data/cec6563e-580e-4278-b50c-adbd73220f53/features.json?key=WwTF2RiyjHztaQU4fkAW) API endpoint supports GET requests and responds with a point dataset of targeted conservation sites in India in GeoJSON format. This visualization is in the form of an interactive map that mimics the UI of standard GIS software like ArcGIS and QGIS. It consists of a base map (open street map/satellite image) and two layers of spatial data (sanctuary layer & national park layer) on top of it. We can activate any one of the base maps and any one or both of the data layers at a time using the layers icon in the bottom left corner of the map. This visualization provides three different ways to identify a conservation site:
<br>
i. **Using location (_latitude_ and _longitude_)**
<br>
The bottom right corner of the map contains a latitude-longitude table that keeps track of the current location of your mouse pointer. So if you know the approximate location of the conservation site you are looking for, you can move the mouse pointer over the map and locate it by checking this table.
<br>
ii. **Using any non-spatial attribute**
<br>
The top right of the map contains a search icon that gives you an option for a fuzzy search on values of non-spatial attributes of all data points. For example, suppose you want to find the sites where the big cat species are being protected. The scientific names of all big cats start with ‘panthera’. In the web service, we are using, scientific names are included in the species attribute. So you just need to type ‘panthera’ in the search bar. This should give you a list of all data points with some non-spatial attribute value matching ‘panthera’.
<br>
iii. **Using suitable base map**
<br>
Suppose you have no idea about the lat-long or any of the non-spatial attributes of the data point you are looking for. In this case, you may be able to make use of a suitable base map to locate the point. For example, suppose you want to find all the conservation sites with a cold climate. By using the satellite image as your base map, you can easily identify all the snow-covered areas and locate all the conservation sites that lie inside these regions.

## How we built it
This visualization was built using standard web technologies (html, css, js and jquery). Web map was built using leaflet library and leaflet-fusesearch plugin.

## Challenges we ran into
There were no issues working with the visualization feature thanks to its simple design and well-written documentation.

## Accomplishments that we're proud of
Being someone who has been using GIS software for some years, I think this is a reasonably good UI. This will enable easy adoption of postman by GIS analysts who don't have much technical knowledge and experience working with GeoJSON.

## What we learned
The biggest learning has been the visualization feature itself. I will definitely use it in my future projects.

## What's next for GeoJSON Visualizer with Fuzzy Search
An option to select data points of interest and export them to create a subset of the original geojson response.
