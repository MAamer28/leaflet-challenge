// Defining the GeoJSON url source
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Executing a get request to the url to retrieve GeoJSON data
d3.json(url).then(function(data) {
    createEQ(data.features);
});

function markerSize(magnitude) {
    return magnitude * 5000;
};

function markerColor(depth) {
    if (depth < 10) return "green";
    else if (depth < 30) return "yellowgreen";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "red";
};

function createEQ(EQData, platesData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`Location: ${feature.properties.place} <br> Time: ${new Date(feature.properties.time)}
        <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`);
    }

    let EQs = L.geoJSON(EQData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {

        let markers = {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.75,
            color: "black",
        }
        return L.circle(latlng, markers);
    }
    });


    createMap(EQs);
};

function createMap(EQs) {
    let maptile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let myMap = L.map("map", {
        center: [39.8282, -98.5795],
        zoom: 5,
        layers: [maptile, EQs]
    });

    let legend = L.control({position: "bottomright"});
    
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info-legend");
        var depth = [-10, 10, 30, 50, 70, 90];
        var labels = []
        var legendInfo = "<h3 style = 'text-align: right'> Depth </h3>"

        div.innerHTML = legendInfo

        for (var i = 0; i < depth.length; i++) {
            labels.push('<ul style = "background:' + markerColor(depth[i] + 1) + '"> <span>' 
            + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span> </ul>');
        }

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";

        return div;
    };

    legend.addTo(myMap)
};