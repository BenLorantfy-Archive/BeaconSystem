// Author: Ben Lorantfy
(function($) {
		
		// [ Helper gps function ]
		// - Requires https://github.com/apache/cordova-plugin-geolocation
		// - Provides more robust error logging
		// - Tries a few times if GPS fails
		$.gps = function(success,error){
			var numTries = 0;
			
			function getPosition(){
				navigator.geolocation.getCurrentPosition(function(position){
					if(typeof success == "function"){
						success(position.coords);
					}
				},function(err){
					
					numTries++;
					if(numTries < $.gps.maxTries){
						if($.gps.debug){
							console.warn("GPS failed, trying again in 300ms... (Number of current tries: " + numTries + ")");
						}

						setTimeout(getPosition, 300);
					}else{
						if($.gps.debug){
							console.error("GPS failed and reached max tries. Error Message: " + err.message);
						}
						
						if(typeof error == "function"){
							error();
						}
					}
					
				})				
			}
			
			getPosition();

		}

		// [ Use to turn on/off error logging ]
		$.gps.debug = true;
		
		// [ Use to specify number of times to try again if GPS fails ]
		$.gps.maxTries = 5;

}(jQuery));





