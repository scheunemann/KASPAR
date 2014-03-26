(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'angularResource',
	                     './proxyServices' 
	                     ];
	
	define(dependancies, function(angular, resource, proxyServices) {
		var ProxyResourceInterceptor = function($injector, $q, objectCache) {
			var modObject = function(respObj) {
				for ( var prop in respObj) {
					if (respObj[prop] != undefined && respObj[prop].hasOwnProperty('proxyObject') && $injector.has(respObj[prop].type)) {
						respObj[prop + '_metaData'] = {};
						respObj[prop + '_metaData']['data'] = respObj[prop];
						respObj[prop + '_metaData']['resolved'] = false;
						respObj[prop + '_metaData']['resource'] = $injector.get(respObj[prop].type);
						if (respObj[prop + '_metaData']['data'].isList) {
							respObj[prop] = [];
						} else {
							respObj[prop] = {};
						}
					}
				}
			};

			var unModObject = function(reqObj) {
				for ( var prop in reqObj) {
					if (reqObj[prop] != undefined) {
						if (reqObj[prop + '_metaData'] != undefined) {
							if (!reqObj[prop + '_metaData']['resolved']) {
								reqObj[prop] = reqObj[prop + '_metaData']['data'];
							}

							delete reqObj[prop + '_metaData'];
						} else if (angular.isArray(reqObj[prop])) {
							for ( var idx in reqObj[prop]) {
								unModObject(reqObj[prop][idx]);
							}
						}
					}
				}
			}

			return {
				'response' : function(response) {
					if (response != undefined && typeof response.data != "string") {
						if (response.config.url.substring(0, 5) == '/api/') {
							if (angular.isArray(response.data)) {
								for (var i = 0; i < response.data.length; i++) {
									if (response.data[i].hasOwnProperty('id')) {
										var key = response.config.url + '/' + response.data[i].id;
										if (objectCache.hasObj(key)) {
											response.data[i] = objectCache.getObj(key);
										} else {
											modObject(response.data[i]);
											objectCache.setObj(key, response.data[i]);
										}
									}
								}
							} else {
								if (response.data.hasOwnProperty('id')) {
									var key = response.config.url;
									if (objectCache.hasObj(key)) {
										response.data = objectCache.getObj(key);
									} else {
										modObject(response.data);
										objectCache.setObj(key, response.data);
									}
								}
							}
						}
					}

					return response;
				},
				'request' : function(request) {
					if (request.method == "POST") {
						unModObject(request.data);
						var key = request.url;
						objectCache.removeObj(key);
					}

					return request;
				}
			}
		};

		return [ '$injector', '$q', 'objectCache', ProxyResourceInterceptor ];
	});
}());