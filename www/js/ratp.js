$(document).ready(function() {
    $.ajax({
            'url':'https://data.ratp.fr/api/records/1.0/search/?dataset=positions-geographiques-des-stations-du-reseau-ratp&rows=169&facet=stop_name',
            'data': {
            },
            'datatype': 'json',
            'type': 'GET',
            'success': function (texteJson) {
            },
            'error': function (data) {
                console.log(data);
            } 
        });


        var NomBus = new Array();
        var CodeBus = new Array();
        $.ajax({
            'url':'https://api-ratp.pierre-grimaud.fr/v4/lines/buses', // lignes de BUS
            'data': {
            },
            'datatype': 'json',
            'type': 'GET',
            'success': function (texteJson) {
                for (var i = 0 ; i < texteJson.result.buses.length ; i++){
                    NomBus[i] = texteJson.result.buses[i].name;
                    CodeBus[i] = texteJson.result.buses[i].code;
                }

                var GetBusName = "";
                GetBusName += '<h3>Choisissez votre ligne de bus</h3><select id="BusSelect" onchange="ChangeStationName(this.value)">';
                for (var i = 0 ; i < NomBus.length; i++){
                    GetBusName += '<option value="'+CodeBus[i]+'">'+NomBus[i]+'</option>';
                }
                GetBusName += '</select>';
                $(GetBusName).appendTo("#SelectionStation");

            },

            'error': function (data) {
                console.log(data);
            }
        });
    });


    function ChangeStationName(code){
        var NomStationLigne = new Array();
        var slug = new Array();

        $.ajax({
            'url':'https://api-ratp.pierre-grimaud.fr/v4/stations/buses/'+code, // Stations de la ligne de BUS
            'data': {
            },
            'datatype': 'json',
            'type': 'GET',
            'success': function (texteJson) {
                for (var i = 0 ; i < texteJson.result.stations.length ; i++){
                    NomStationLigne[i] = texteJson.result.stations[i].name;
                    slug[i] = texteJson.result.stations[i].slug;
                }

                var GetNomStationLigne = "";
                GetNomStationLigne += '<h3>Selectionnez votre arrêt</h3><select id="SelectArret" onchange="Schedule(this.value)">';
                for (var i = 0 ; i < NomStationLigne.length; i++){
                    GetNomStationLigne += '<option value="'+code+'/'+slug[i]+'">'+NomStationLigne[i]+'</option>';
                }
                GetNomStationLigne += '</select>';
                $("#StationsLigneX").html(GetNomStationLigne);

                
            },
        });      
    }
    setInterval(ChangeStationName,60000);


    function Schedule(valueCodeStation){
        var Bus = new Array();
        var Destination = new Array();

        $.ajax({
            'url':'https://api-ratp.pierre-grimaud.fr/v4/schedules/buses/'+valueCodeStation+'/A%2BR', // Stations de la ligne de BUS
            'data': {
            },
            'datatype': 'json',
            'type': 'GET',
            'success': function (texteJson) {
                for (var i = 0 ; i < texteJson.result.schedules.length ; i++){
                    Bus[i] = texteJson.result.schedules[i].message;
                    Destination[i] = texteJson.result.schedules[i].destination;
                }
                var DisplayTime = "";
                for (var i = 0 ; i < texteJson.result.schedules.length ; i++){
                DisplayTime += '<p> Prochain bus : '+Bus[i]+' à destination de '+Destination[i]+'</p>';
                }
                $("#horaires").html(DisplayTime);
            },
        }); 
    }
    setInterval(Schedule,60000);

        var onSuccess = function(position) 
        {
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n');
          
            map = new OpenLayers.Map("map");
            map.addLayer(new OpenLayers.Layer.OSM());

            var lonLat = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude)
                .transform(
                    new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                    map.getProjectionObject() // to Spherical Mercator Projection
                );
                
            var zoom=16;
            var markers = new OpenLayers.Layer.Markers( "Markers" );

            map.addLayer(markers);
            markers.addMarker(new OpenLayers.Marker(lonLat));
            map.setCenter (lonLat, zoom);

            function getLocation(){
                navigator.geolocation.getCurrentPosition(LocationOK, LocationKO);
            }
            function LocationOK(position)
            {
                var point = new OpenLayers.Geometry.Point(position.coords.longitude,position.coords.latitude);
                var pointProj = new OpenLayers.Projection.transform(
                    point,
                    new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("IGNF:GEOPORTALFXX"),
                    alert(map.getMap().getProjection())
                );
                map.getMap().setCenter(new OpenLayers.LonLat(pointProj.x, pointProj.y), 6);
            }
            function LocationKO()
            {
                alert('Votre localisation est impossible, vérifiez que cette option est activée sur votre mobile');
            }
                }

                function onError(error) 
                {
                    alert('code: '    + error.code    + '\n' +
                        'message: ' + error.message + '\n');
                }

                navigator.geolocation.getCurrentPosition(onSuccess, onError); 

    

    


