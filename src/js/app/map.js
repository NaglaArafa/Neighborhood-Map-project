var map,
    markers = [], // Create an array for all the markers.
    locations = [], // Create an array for all the Locations.
    largeInfowindow;

//loading data from json file
$.getJSON("./locations.json", function (data) {
    ko.utils.arrayForEach(data, function (item) {
        locations.push(item);
    });
}).done(function () {
    ko.applyBindings(new FilterList(locations));
}).fail(function (error) {
    alert("Can't load locations, Please refresh to try again.")
});

//create new marker
this.setMarker = function (position, title, id, venueID) {
    this.marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: id,
        venueID: venueID
    });
    markers.push(this.marker);
    this.marker.addListener('click', openInfoWindow)
}

//function that handle click on listItem or marker
this.openInfoWindow = function () {
    populateInfoWindow(markers[this.id], largeInfowindow)
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
this.populateInfoWindow = function (marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
        map.panTo(infowindow.marker.position);
        callFourSquareApi(marker.venueID, infowindow);
        map.setZoom(13);
        infowindow.open(map, marker);
        setTimeout(function () {
            infowindow.marker.setAnimation(null);
        }, 1400);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
            map.setZoom(11);
        });
    }
}

//FourSquare Api Function
function callFourSquareApi(venueID, infowindow) {
    var ClientID = 'GKFSFL01K4A3QNPFWPBRALYXPA4OSKVWYAAAOW441TY3P2BR',
        ClientSecret = 'Z1ZKVHZQPJUHW0TR1FT0QFASMPIT0KMZIZSVZ3IRAMFVAEU0',
        URL = 'https://api.foursquare.com/v2/venues/' + venueID + '?client_id=' + ClientID + '&client_secret=' + ClientSecret + '&v=20180312';

    $.getJSON(URL).done(function (data) {
        console.log(data.response.venue);
        var response = data.response.venue || '',
            name = response.name || '',
            phone = response.contact.phone || '',
            description = response.description || '',
            url = response.url || '',
            crossStreet=response.location.crossStreet ||'',
            address=response.location.address||'',
            city=response.location.city || ''
            country=response.location.country || '',
            fullAddress = crossStreet+ ', ' +address  + ', ' + city  + ', ' + country;

        infowindow.setContent('<div>' + name + '</div><div>' + phone + '</div><div>' + description + '</div><div>' + url + '</div><div>' + fullAddress + '</div>');
    }).fail(function () {
        alert("There was an error, Data can't be loaded. Please refresh the page to try again.");
    });
}

//initial function that loaded after map loaded
this.initMap = function () {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.0518051, lng: 31.4022244 },
        zoom: 11
    });

    largeInfowindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var id = locations[i].id;
        var venueID = locations[i].venueID;

        // Create a marker per location, and put into markers array.
        this.setMarker(position, title, id, venueID)
    }
}



