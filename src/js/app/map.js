var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.0518051, lng: 31.4022244},
        zoom: 12
    });

    // These are the real estate listings that will be shown to the user.
    var locations = [
        { title: 'CFC', location: { lat: 30.031958, lng: 31.408473 } },
        { title: 'Family Park', location: { lat: 30.080482, lng: 31.50214 } },
        { title: 'Cairo International Airport', location: { lat: 30.112363, lng: 31.400289 } },
        { title: 'ITWORX', location: { lat: 30.030926, lng: 31.341619 } },
        { title: "Papa john's Pizza", location: { lat: 30.058306, lng: 31.326522 } },
        { title: 'Chinatown Homey Space', location: { lat: 40.7180628, lng: -73.9961237 } }
    ];

    var largeInfowindow = new google.maps.InfoWindow();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map:map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        bounds.extend(marker.position)
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
    }
    
}

// This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
}

function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }
  // This function will loop through the listings and hide them all.
  function hideListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }