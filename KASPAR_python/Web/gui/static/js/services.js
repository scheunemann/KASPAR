'use strict';

angular.module('proxyService', [ 'ngResource' ])
	.service('proxyObjectResolver', function() {
    	this.resolveProp = function(object, propName) {
    		return this.getFunc(object, propName)();
    	}
    	
    	this.getFunc = function(object, propName) {
			return function() {
				if(object[propName] === undefined) {
					if(object[propName + '_metaData'].isList) {
						object[propName] = [];
						for(var index = 0; index < object[propName + '_metaData'].ids.length; index++) {
							var id = object[propName + '_metaData'].ids[index];
							var key = [propName + '_metaData']['uri'] + id.toString();
							var obj = object[propName + '_metaData']['resource'].get({id: id});
							object[propName].push(obj);
						}
					} else {
						var id = object[propName + '_metaData'].ids[0];
						var key = [propName + '_metaData']['uri'] + id.toString();
						var obj = object[propName + '_metaData']['resource'].get({id: id});
						object[propName ] = obj;
					}
				}
				
				return object[propName];
			};
    	}
    	
    	this.setFunc = function(object, propName) {
    		return function() {
    			object[propName] = val;
    		}
    	}
	})
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
