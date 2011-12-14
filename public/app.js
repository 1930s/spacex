$(document).ready(function () {
	
	var map = new google.maps.Map($("#map")[0], {
		zoom: 3, 
		center: new google.maps.LatLng(40, -20), 
		mapTypeId: google.maps.MapTypeId.TERRAIN
	}); 
	
	var geocoder = new google.maps.Geocoder();

	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push($("#status")[0]); 
	
	function set_status(text) {
		$("#status-text").text(text); 
	}
	
	set_status("Downloading ground station coordinates..."); 
	$.ajax({
		url: "stations"
	}).done(function (response) {
		set_status("Plotting ground stations...");
		var i, marker; 
		var markers = new Array(); 	
		var info_window = new google.maps.InfoWindow();
		for (i = 0; i < response.length; i++) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(response[i].latitude, response[i].longitude), 
				map: map
			});	
			markers.push(marker); 
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
		for (i = 0; i < markers.length; i++) {
			set_status("Resolving station " + (i+1) + " of " + markers.length); 
			geocoder.geocode({'latLng': markers[i].getPosition()}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var country = null; 
					var j; 
					for (j = 0; j < results.length; j++) {
						var k; 
						for (k = 0; k < results[j].length; k++) {
							if (!country && $.inArray("country", results[j][k].types) != -1) {
								country = results[j][k].short_name; 
							}
						}
					}
					if (country) {
						console.log(country); 
						// ...
					}
				} else {
					console.log(status); 
				}
			}); 
		}
		set_status(""); 
	}).fail(function (response) {
		set_status("Sorry, an error occurred"); 
	}); 
	
}); 
