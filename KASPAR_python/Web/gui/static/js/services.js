'use strict';

angular.module('proxyService', [ 'ngResource' ])
	.service('proxyObjectResolver', ['$q', '$timeout', function($q, $timeout) {
    	this.resolveProp = function(object, propName) {
    		return this.getFunc(object, propName)();
    	}
    	
    	this.getFunc = function(object, propName) {
			return function() {
				if(object != undefined) { 
					if(object[propName] === undefined && object[propName + '_metaData'] != undefined) {
						if(object[propName + '_metaData'].isList) {
							var def = $q.defer();
							
							$timeout(function() {
								console.log('Loading: ' + propName);
								var objs = [];
								var p = $q.when(true);
								for(var index = 0; index < object[propName + '_metaData'].ids.length; index++) {
									var id = object[propName + '_metaData'].ids[index];
									var key = [propName + '_metaData']['uri'] + id.toString();
									var obj = object[propName + '_metaData']['resource'].get({id: id});
									objs.push(obj.$promise);
								}

								return $q.all(objs).then(function(vals) {
									def.resolve(vals);
								});
							});
							
							object[propName] = def.promise;
						} else {
							var id = object[propName + '_metaData'].ids[0];
							var key = [propName + '_metaData']['uri'] + id.toString();
							var obj = object[propName + '_metaData']['resource'].get({id: id});
							object[propName] = obj;
						}
					}
				
					return object[propName];
				}
			};
    	}
    	
    	this.setFunc = function(object, propName) {
    		return function() {
    			object[propName] = val;
    		}
    	}
	}])
    .factory('proxyResourceInterceptor', ['proxyObjectResolver', '$injector', function(proxyObjectResolver, $injector) {
    	var modObject = function(respObj) {
			for(var prop in respObj) {
				if (respObj[prop] != undefined && respObj[prop].hasOwnProperty('proxyObject') && $injector.has(respObj[prop].type)) {
					respObj[prop + '_metaData'] = respObj[prop];
					respObj[prop + '_metaData']['resource'] = $injector.get(respObj[prop].type);
					
					delete respObj[prop];
					//respObj.__defineGetter__(prop, getFunc(respObj, prop));							
					respObj.__defineSetter__(prop, proxyObjectResolver.setFunc(respObj, prop));
				}
			}
    	};
    	
    	return {
    		'response': function(response) {
    			if (response != undefined && typeof response.data != "string") {
    				if(angular.isArray(response.data)) {
    					for(var i = 0; i < response.data.length; i++) {
    						modObject(response.data[i]);
						}
					} else {
						modObject(response.data);
					}
				}
    			
    			return response;
    		}
    	}
    }])
;
