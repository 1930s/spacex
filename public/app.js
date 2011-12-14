$(document).ready(function () {
	
	var map = new google.maps.Map($("#map")[0], {
		zoom: 3, 
		center: new google.maps.LatLng(40, -20), 
		mapTypeId: google.maps.MapTypeId.TERRAIN
	}); 
	
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push($("#status")[0]); 
	
	function set_status(text) {
		$("#status-text").text(text); 
	}
	
	set_status("Downloading coordinates..."); 
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
		set_status(""); 
	}).fail(function (response) {
		set_status("Sorry, an error occurred"); 
	}); 
	
}); 
