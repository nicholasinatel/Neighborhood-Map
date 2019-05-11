var map;

// Create a new blank array for all the listing markers.
var markers = [];

// This global polygon variable is to ensure only ONE polygon is rendered.
var polygon = null;

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

var list = [];

var CLIENT_ID_FQ = "EE24NJZ4PU4LJAG2NUDL3GHV55CQJ0VHM20VIM5G1UXYLRKT";
var CLIENT_SECRET_FQ = "I4E51LOHGMUY5XKL24YVXUWDQQT55QGLHHVFJOBAFJ5OXOE1";


function initMap() {

    // Create a styles array to use with the map.
    var styles = [{
        featureType: 'water',
        stylers: [{
            color: '#19a0d8'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
                color: '#ffffff'
            },
            {
                weight: 6
            }
        ]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -40
            }
        ]
    }, {
        featureType: 'transit.station',
        stylers: [{
                weight: 9
            },
            {
                hue: '#e85113'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
                visibility: 'on'
            },
            {
                color: '#f0e4d3'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -25
            }
        ]
    }];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.725248,
            lng: -73.996143
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });


    // Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());


    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    // var locations = [{
    //         title: 'Housing Works Bookstore Cafe',
    //         id: "3fd66200f964a52020e61ee3",
    //         location: {
    //             lat: 40.72467539483391,
    //             lng: -73.9966368227625
    //         }
    //     },
    //     {
    //         title: 'Gato',
    //         id: "530fd80111d2a2ac65390a18",
    //         location: {
    //             lat: 40.7255277558998,
    //             lng: -73.99506116064295
    //         }
    //     },
    //     {
    //         title: 'Estela',
    //         id: "51c34f3d5019f1cc0e1d1211",
    //         location: {
    //             lat: 40.724681,
    //             lng: -73.994725
    //         }
    //     },
    //     {
    //         title: 'Lure Fishbar',
    //         id: "46ff98a7f964a520234b1fe3",
    //         location: {
    //             lat: 40.724703,
    //             lng: -73.9983278
    //         }
    //     },
    //     {
    //         title: 'Emilios Ballato',
    //         id: "4b0ddac5f964a520645123e3",
    //         location: {
    //             lat: 40.72482135181598,
    //             lng: -73.9945343878065
    //         }
    //     }
    // ];
    /**
     * * MODEL
     */
    var locations = [];

    // var largeInfowindow = new google.maps.InfoWindow();
    window.largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    getPlacesFrom4Square(locations);

    console.log("locations: ", locations);
    console.log("locations.length: ", locations.length);

    // Create ViewModel
    ko.applyBindings(new ViewModel());


    document.getElementById('show-listings').addEventListener('click', showListings);

    document.getElementById('hide-listings').addEventListener('click', function () {
        hideMarkers(markers);
    });

    document.getElementById('zoom-to-area').addEventListener('click', function () {
        zoomToArea();
    });

    document.getElementById('search-within-time').addEventListener('click', function () {
        searchWithinTime();
    });

    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place.
    searchBox.addListener('places_changed', function () {
        searchBoxPlaces(this);
    });

    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place.
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function showSomeMarkers(selectedMarkers) {
    hideMarkers(markers);
    if (selectedMarkers.length < 5) {
        for (var i = 0; i < markers.length; i++) {
            for (var j = 0; j < selectedMarkers.length; j++) {
                if (markers[i].title == selectedMarkers[j].title) {
                    markers[i].setMap(map);
                }
            }
        }
    } else {
        showListings();
    }
}

function showSingleMark(place) {
    markers.forEach((elem, index, array) => {
        if (elem.title == place) {
            // markers[index].setMap(map);
            populateInfoWindow(markers[index], largeInfowindow);
        }
    });
}

// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}


// This function takes the input value in the find nearby area text input
// locates it, and then zooms into that area. This is so that the user can
// show all listings, then decide to focus on one area of the map.
function zoomToArea() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-to-area-text').value;
    // Make sure the address isn't blank.
    if (address == '') {
        window.alert('You must enter an area, or address.');
    } else {
        // Geocode the address/area entered to get the center. Then, center the map
        // on it and zoom in
        geocoder.geocode({
            address: address,
            componentRestrictions: {
                locality: 'New York'
            }
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
            } else {
                window.alert('We could not find that location - try entering a more' +
                    ' specific place.');
            }
        });
    }
}

// This function creates markers for each place found in either places search.
function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
        });
        // Create a single infowindow to be used with the place details information
        // so that only one is open at once.
        var placeInfoWindow = new google.maps.InfoWindow();
        // If a marker is clicked, do a place details search on it in the next function.
        marker.addListener('click', function () {
            if (placeInfoWindow.marker == this) {
                console.log("This infowindow already is on this marker!");
            } else {
                getPlacesDetails(this, placeInfoWindow);
            }
        });
        placeMarkers.push(marker);
        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}

// This is the PLACE DETAILS search - it's the most detailed so it's only
// executed when a marker is selected, indicating the user wants more
// details about that place.
function getPlacesDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.id
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Set the marker property on this infowindow so it isn't created again.
            infowindow.marker = marker;
            var innerHTML = '<div>';
            if (place.name) {
                innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
                innerHTML += '<br><br><strong>Hours:</strong><br>' +
                    place.opening_hours.weekday_text[0] + '<br>' +
                    place.opening_hours.weekday_text[1] + '<br>' +
                    place.opening_hours.weekday_text[2] + '<br>' +
                    place.opening_hours.weekday_text[3] + '<br>' +
                    place.opening_hours.weekday_text[4] + '<br>' +
                    place.opening_hours.weekday_text[5] + '<br>' +
                    place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
                    maxHeight: 100,
                    maxWidth: 200
                }) + '">';
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
    });
}

function getPlacesFrom4Square(locations) {
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: "https://api.foursquare.com/v2/venues/explore",
        data: "client_id=" + CLIENT_ID_FQ +
            "&client_secret=" + CLIENT_SECRET_FQ +
            "&intent=match" +
            "&v=20180323" +
            "&ll=40.725248,-73.996143" +
            "&query=restaurant" +
            "&limit=5",
        success: function (ajaxResp) {
            // alert("Data Saved: " + ajaxResp);
            // console.log("ajaxResp: ", ajaxResp);
            // console.log("titles: ", ajaxResp.response.groups[0].items[0].venue.name);
            // console.log("id: ", ajaxResp.response.groups[0].items[0].venue.id);
            // console.log("lat: ", ajaxResp.response.groups[0].items[0].venue.location.lat);
            // console.log("long: ", ajaxResp.response.groups[0].items[0].venue.location.lng);

            const respArray = ajaxResp.response.groups[0].items;

            for(var i = 0; i < respArray.length; i++){
                let venue = {
                    title: respArray[i].venue.name,
                    id: respArray[i].venue.id,
                    location: {
                        lat: respArray[i].venue.location.lat,
                        lng: respArray[i].venue.location.lng
                    }
                }
    
                locations.push(venue);
            }
            console.log("FIRST");
            createMarkersArray(locations);
        },
        error: function (e) {
            alert("Could not retrieve data from FourSquare API");
        }
    });
}

function createMarkersArray(locations) {
    console.log("SECOND");
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
            // Get the position from the location array.
            var position = locations[i].location;
            var title = locations[i].title;
    
            var listObj = {
                title: locations[i].title,
                position: locations[i].location
            };
    
            list.push(listObj);
    
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,
                id: i
            });
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open the large infowindow at each marker.
            marker.addListener('click', function () {
                populateInfoWindow(this, largeInfowindow);
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            marker.addListener('mouseover', function () {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function () {
                this.setIcon(defaultIcon);
            });
        }
}

var ViewModel = function () {
    var self = this;

    self.filterText = ko.observable(""); // Text from search field

    this.theList = ko.observableArray(list);

    this.selectPlace = function (data, event) {
        // do something here
        showSingleMark(data.title);
    }

    self.theListFiltered = ko.computed(function () {
        fText = self.filterText().replace(/\s+/g, ' ');
        var filteredList = ko.utils.arrayFilter(self.theList(), function (test) {
            if (fText.length)
                return (test.title.toUpperCase().indexOf(fText.toUpperCase()) >= 0);
            else
                return 1;
        });
        showSomeMarkers(filteredList);
        return filteredList;
    }, self);
};
