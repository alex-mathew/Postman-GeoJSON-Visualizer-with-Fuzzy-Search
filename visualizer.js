let template = `
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.1.0/dist/leaflet.css" integrity="sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.1.0/dist/leaflet.js" integrity="sha512-mNqn2Wg7tSToJhvHcqfzLMU6J4mkOImSPTxVZAdo+lcPlk+GhZmYgACEe0x35K7YzW1zJ7XyJV/TT1MrdXvMcA==" crossorigin=""></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="http://dev.cartocite.fr/CultureNantes/js/vendor/fuse.js"></script>
    <script src="http://dev.cartocite.fr/CultureNantes/js/leaflet.fusesearch.js"></script>
    <link rel="stylesheet" href="http://dev.cartocite.fr/CultureNantes/css/leaflet.fusesearch.css"/>
    <style>
        #map {
            position:absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 4px;
        }
        a.button {
            margin: 0px 0px 0px 0px;
            padding: 0px 0px 0px 0px;
        }
        #coordinates {
            position: absolute;
            bottom: -25px;
            right: 0px;
            padding: 0px;
            z-index: 2000;
            background-color: white;
            display: none;
        }
        #coordinates.table {
            margin: 0px 0px 0px 0px;
        }
    </style>
    <div id="map"></div>
    <div id="coordinates">
        <table>
            <tr>
                <td>Latitude</td>
                <td id="lat"></td>
            </tr>
            <tr>
                <td>Longitude</td>
                <td id="lng"></td>
            </tr>
        </table>
    </div>
    <script>
        var map = L.map('map').setView([22.9734, 78.6569], 4);
        var base1=new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{ 
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});
        var base2 = new L.tileLayer('https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=WwTF2RiyjHztaQU4fkAW',{crossOrigin: true})
        base2.addTo(map);
        function forEachFeature(feature, layer) {
            var popupContent = '<h4>'+ feature.properties.name +'</h4><br><center><img src='+feature.properties.img+' img style=width:200px;height:300x;></center><br><table><tr><td><b>State</b></td><td>'+feature.properties.state+'</td></tr><tr><td><b>Type</b></td><td>'+feature.properties.type+'</td></tr><tr><td><b>Protected Species</b></td><td>'+feature.properties.species+'</td></tr></table>';
            layer.bindPopup(popupContent);
        };
        var nationalParks = L.geoJSON(null, {
            onEachFeature: forEachFeature, 
            filter: function(feature, layer) {   
                return (feature.properties.type == "National Park");
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius:6,
                    color: 'blue', 
                    fillColor: 'blue',
                    fillOpacity: 1
                });
            }
        });
        pm.getData( function (error, data) {
            nationalParks.addData(data.response);
            nationalParks.addTo(map);
        })
        var sancturies = L.geoJSON(null, {
            onEachFeature: forEachFeature,
            filter: function(feature, layer) {   
                return (feature.properties.type == "Sanctuary");
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius:6,
                    color: 'maroon', 
                    fillColor: 'maroon', 
                    fillOpacity: 1
                });
            }
        });
        pm.getData( function (error, data) {
            sancturies.addData(data.response);
            sancturies.addTo(map);
        })
        var options = {
            position: 'topright',
            title: 'Chercher',
            placeholder: 'ex: panthera',
            maxResultLength: 15,
            threshold: 0.3,
            showInvisibleFeatures: true,
            showResultFct: function(feature, container) {
                props = feature.properties;
                var div = L.DomUtil.create('div', null, container);
                var name = L.DomUtil.create('b', null, container);
                name.innerHTML = props.name;
                var cat = props.state, info = '' + cat + ', ' + props.species;
                div.appendChild(document.createTextNode(info));
                div.data_lat = feature.geometry.coordinates[0];
                div.data_long = feature.geometry.coordinates[1]; 
                div.data_name = props.name;
                container.appendChild(div);
                var curr = null
                div.onclick = function() {
                    map.eachLayer(function (layer) { 
                        console.log(layer);
                        if(layer.feature != null && layer.feature.properties.name == div.data_name) {
                            layer.fire('click');
                            map.setView([div.data_long+1, div.data_lat], 8);
                            document.getElementById('lat').innerHTML = div.data_lat.toFixed(4);
                            document.getElementById('lng').innerHTML = div.data_lng.toFixed(4);
                        }
                    });
                }
            }
        }
        pm.getData( function (error, data) {
            var fuseSearchCtrl = L.control.fuseSearch(options);
            var props = ['name', 'state', 'species', 'type'];
            fuseSearchCtrl.indexFeatures(data.response.features, props);
            map.addControl(fuseSearchCtrl);
        })
        var baseMaps= {
            "Open Street Map":base1,
            "Satellite Image": base2
        }
        var overlay= {
            "Sancturies":sancturies,
            "National Parks": nationalParks
        }
        L.control.layers(baseMaps, overlay, {
            position: 'bottomleft'
        }).addTo(map);  
        L.control.scale({
            metric: true,
            imperial: true,
            position: 'topleft'
        }).addTo(map);
        map.on('mousemove', function(e) {
            document.getElementById('lat').innerHTML = e.latlng.lat.toFixed(4)+'&deg';
            document.getElementById('lng').innerHTML = e.latlng.lng.toFixed(4)+'&deg';
        });
        map.on('mouseout', function(e) {
            document.getElementById('coordinates').style.display = 'none';
            document.getElementById('lat').innerHTML = '';
            document.getElementById('lng').innerHTML = '';
        });
        map.on('mouseover', function(e) {
            document.getElementById('lat').innerHTML = e.latlng.lat.toFixed(4)+'&deg';
            document.getElementById('lng').innerHTML = e.latlng.lng.toFixed(4)+'&deg';
            document.getElementById('coordinates').style.display = 'block';
        });
    </script>
`;
var locations = encodeURIComponent(JSON.stringify(pm.response.json()));
pm.visualizer.set(template, {response: pm.response.json()})
