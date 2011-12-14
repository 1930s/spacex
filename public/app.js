$(document).ready(function () {
	
	// Render the Google Map
	var map = new google.maps.Map($("#map")[0], {
		zoom: 3, 
		center: new google.maps.LatLng(40, -20), 
		mapTypeId: google.maps.MapTypeId.TERRAIN
	}); 
	
	// Add the status text as a Google Map control
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push($("#status")[0]); 
	
	// Helper for changing the status message
	function set_status(text) {
		$("#status-text").text(text); 
	}
	
	set_status("Downloading coordinates..."); 
	// Download the JSON data from the backend
	$.ajax({
		url: "stations"
	}).done(function (response) {
		set_status("Plotting ground stations...");
		var i, marker; 
		var markers = new Array(); 	
		var info_window = new google.maps.InfoWindow();
		// Place the markers on the map
		for (i = 0; i < response.length; i++) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(response[i].latitude, response[i].longitude), 
				map: map
			});	
			markers.push(marker); 
			// Add an information window to each marker that pops up when the marker is clicked
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
        		return function() {
          			info_window.setContent(
	          			"<p><strong>" + response[i].name + " (" + 
	          			response[i].id + ")</strong><br />" + response[i].latitude + 
	          			", " + response[i].longitude + "</p>"
	          		);
          			info_window.open(map, marker);
        		}
      		})(marker, i));
		}
		set_status(""); 
	}).fail(function (response) {
		set_status("Sorry, an error occurred"); 
	}); 
	
}); 
