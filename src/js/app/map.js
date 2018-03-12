var map;

// Create a new blank array for all the listing markers.
var markers = [];
var locations = [];
var largeInfowindow;
//loading data from json file
$.getJSON("js/locations.json", function(data) {
        ko.utils.arrayForEach(data, function(item) {
            locations.push(item);
        });
    })
    .done(function() {
        ko.applyBindings(new Filtering(locations));
    })
    .fail(function(error) {
        console.log('error')
    });



this.setMarker = function(position, title, id, largeInfowindow) {
    this.marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: id
    });
    markers.push(this.marker);
    this.marker.addListener('click', openInfoWindow)
}
this.initMap = function() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.0518051, lng: 31.4022244 },
        zoom: 12
    });

    // These are the real estate listings that will be shown to the user.
    largeInfowindow = new google.maps.InfoWindow();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var id = locations[i].id;
        // Create a marker per location, and put into markers array.
        this.setMarker(position, title, id, this.largeInfowindow)
    }


}

function openInfoWindow() {
    populateInfoWindow(markers[this.id], largeInfowindow)
}



// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    console.log(marker)
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        callFourSquareApi(marker.venueID);
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

function callFourSquareApi(venueID) {
    var ClientID = 'GKFSFL01K4A3QNPFWPBRALYXPA4OSKVWYAAAOW441TY3P2BR',
        ClientSecret = 'Z1ZKVHZQPJUHW0TR1FT0QFASMPIT0KMZIZSVZ3IRAMFVAEU0',
        URL = 'https://api.foursquare.com/v2/venues/' + venueID + '?oauth_token=GKFSFL01K4A3QNPFWPBRALYXPA4OSKVWYAAAOW441TY3P2BR';
    $.getJSON(URL).done(function(marker) {
        response.venue.name;
        response.venue.contact;
    })
}