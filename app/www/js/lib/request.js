// Author: Ben Lorantfy
(function($) {
		

		
		// [ Helper request function ]
		// - Requires gps.js
		$.request = function(kind, uri, data, successCallbackFn, errorCallbackFn){
			var successCallback = typeof successCallbackFn === "function" ? successCallbackFn : function(){};
			var errorCallback = typeof errorCallbackFn === "function" ? errorCallbackFn : function(){};
							
			if(typeof data === "function"){
				successCallback = data;
			}	
			
			if(typeof data === "function" && typeof successCallbackFn === "function"){
				errorCallback = successCallback;
			}
				
			// Add beginning slash if not present
			if(uri[0] != "/") uri = "/" + uri; 
			
			// Remove ending slash if present
			var host = $.request.host;
			if(host[host - 1] == "/") host = host.substr(0, host.length - 1); 			

			$.gps(function(coords){
				
				// [ Add position information to device ]
				var xdevice = JSON.stringify({
					 model: 		device.model
					,platform: 		device.platform
					,uuid: 			device.uuid
					,version: 		device.version
					,manufacturer: 	device.manufacturer
					,isVirtual: 	device.isVirtual
					,serial: 		device.serial
					,lat: 			coords.latitude
					,lng: 			coords.longitude
				});
				
				
				// [ Make actual ajax request ]		
				if(kind == "IMAGE" || kind == "IMG"){
					var xhr = new XMLHttpRequest();
				    xhr.open('GET', $.request.host + uri, true);
				    xhr.responseType = 'blob';
					xhr.setRequestHeader("X-Token", $.request.token);
					xhr.setRequestHeader("X-Device", xdevice);
				    xhr.onload = function() {
					    if ( xhr.readyState == 4 ) { 
							if ( xhr.status == 200 ) {
					            var blob = new Blob([this.response], { type: 'image/jpg' });
					            successCallback(blob);							
							}else{
								errorCallback({
									error:"Image Load Failed"
								}); 								
							}
						}
				    };
				    xhr.send();				
					
				}else if(kind == "UPLOAD" || kind == "UP"){
					var ft = new FileTransfer();
					var options = {};
					options.headers = {
						 "X-Token": $.request.token
						,"X-Device": xdevice
					};

					ft.upload(data.url, encodeURI($.request.host + uri), function(response){
						response = JSON.parse(response.response);

						if(response && typeof response === "object"){
							if(response.error){
								errorCallback(response);
								return;
							}
						}

						successCallback(response);
					}, function(){
						errorCallback();
					}, options);

				}else{
					$.ajax({
						 type:kind
						,url:$.request.host + uri
						,data: typeof data != "undefined" && typeof data != "function" ? JSON.stringify(data) : void 0
						,contentType: "application/json; charset=utf-8"
					    ,dataType: "json"
					    ,headers: { 'X-Token': $.request.token, 'X-Device': xdevice }
					}).done(function(response){
	
						if(!response && kind == "GET"){
							errorCallback({
								error:"An error occurred"
							});
							return;
						}
						
						if(response && typeof response === "object"){
							if(response.error){
								errorCallback(response);
								return;
							}
						}
						
						successCallback(response);						
	
					}).fail(function(response){
						errorCallback({
							error:response	
						});
					});					
				}
				

			}, function(){
				errorCallback({
					error:"GPS failed"	
				});
			});
			
			

		}
		
		// [ Default Config ]
		$.request.host = "http://localhost:9696";
		$.request.token = "no token";
		

}(jQuery));





