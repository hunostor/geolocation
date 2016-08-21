var map;

function initMap() {
    var autocomplete;
    var infoWindow;
    var marker;

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 47.4864425,
            lng: 19.0818793
        },
        zoom: 13 
    });

    autocomplete = new google.maps.places.Autocomplete(document.getElementById('map-search-autocomplete'));

    autocomplete.bindTo('bounds', map);

    marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    infoWindow = new google.maps.InfoWindow();

    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        var lat;
        var lng;

        map.setCenter(place.geometry.location);
        map.setZoom(14);

        marker.setIcon({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        });

        
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();

        $.ajax({
            url: 'stores.php',
            type: 'get',
            dataType: 'json',
            data: {
                lat: lat,
                lng: lng
            }
        }).done(function (response) {
            var i;
            var store;
            var stores;
            var infoMarkup = [];
            var storeMarker;
            var storeLocation;

            if (response.count !== 0) {
                stores = response.results;

                for (i = 0; i < response.count; i = i + 1) {
                    store = stores[i];

                    infoMarkup.push('<div class="map-marker-info"><strong>' + store.name + '</strong> <p>' + store.distance.miles + ' kilométerre tőled &bull; <br/ >Tel: ' + store.telephone + ' &bull; <br /><a href="' + store.website + '">' + store.website + '</a></p></div>');

                    storeLocation = new google.maps.LatLng(
                        store.location.lat,
                        store.location.lng
                    );

                    storeMarker = new google.maps.Marker({
                        map: map,
                        position: storeLocation
                    });

                    google.maps.event.addListener(storeMarker, 'click', (function (storeMarker, i) {
                        return function () {
                            infoWindow.setContent('<div>' + infoMarkup[i] + '</div>');
                            infoWindow.open(map, storeMarker);
                        };
                    })(storeMarker, i));
                }
            }

        });

    });
}
