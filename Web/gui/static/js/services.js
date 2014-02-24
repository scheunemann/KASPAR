'use strict';

angular.module('displayService', [])
.service('hotkeyFormatter', [ function() {
	this.getDisplayFromEvent = function(keyEvent) {
		var code = keyEvent.which || keyEvent.keyCode; // Not-IE || IE
		var modifiers = ""
		if (keyEvent.altKey) {
			modifiers += "alt+"
		}

		if (keyEvent.ctrlKey) {
			modifiers += "ctrl+"
		}

		if (keyEvent.shiftKey) {
			modifiers += "shift+"
		}

		var disp = this.getCharDisplay(code);
		if (disp != "" || modifiers != "") {
			return modifiers + disp;
		} else {
			return "";
		}
	}

	this.getCharDisplay = function(charCode) {
		// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		var char;
		if (charCode == 8)
			char = "backspace";
		else if (charCode == 9)
			char = ""; // tab
		else if (charCode == 13)
			char = "enter";
		else if (charCode == 16)
			char = ""; // shift
		else if (charCode == 17)
			char = ""; // ctrl
		else if (charCode == 18)
			char = ""; // alt
		else if (charCode == 19)
			char = ""; // pause/break
		else if (charCode == 20)
			char = ""; // caps
		else if (charCode == 27)
			char = "escape";
		else if (charCode == 32)
			char = "space";
		else if (charCode == 33)
			char = "pageup";
		else if (charCode == 34)
			char = "pagedown";
		else if (charCode == 35)
			char = "end";
		else if (charCode == 36)
			char = "home";
		else if (charCode == 37)
			char = "left";
		else if (charCode == 38)
			char = "up";
		else if (charCode == 39)
			char = "right";
		else if (charCode == 40)
			char = "down";
		else if (charCode == 45)
			char = "ins";
		else if (charCode == 46)
			char = "del";
		else if (charCode == 91)
			char = ""; // left win
		else if (charCode == 92)
			char = ""; // right win
		else if (charCode == 93)
			char = ""; // select
		else if (charCode == 96)
			char = "0";
		else if (charCode == 97)
			char = "1";
		else if (charCode == 98)
			char = "2";
		else if (charCode == 99)
			char = "3";
		else if (charCode == 100)
			char = "4";
		else if (charCode == 101)
			char = "5";
		else if (charCode == 102)
			char = "6";
		else if (charCode == 103)
			char = "7";
		else if (charCode == 104)
			char = "8";
		else if (charCode == 105)
			char = "9";
		else if (charCode == 106)
			char = "*";
		else if (charCode == 107)
			char = "+";
		else if (charCode == 109)
			char = "-";
		else if (charCode == 110)
			char = ".";
		else if (charCode == 111)
			char = "/";
		else if (charCode == 112)
			char = "F1";
		else if (charCode == 113)
			char = "F2";
		else if (charCode == 114)
			char = "F3";
		else if (charCode == 115)
			char = "F4";
		else if (charCode == 116)
			char = "F5";
		else if (charCode == 117)
			char = "F6";
		else if (charCode == 118)
			char = "F7";
		else if (charCode == 119)
			char = "F8";
		else if (charCode == 120)
			char = "F9";
		else if (charCode == 121)
			char = "F10";
		else if (charCode == 122)
			char = "F11";
		else if (charCode == 123)
			char = "F12";
		else if (charCode == 144)
			char = ""; // num lock
		else if (charCode == 145)
			char = ""; // scroll lock
		else if (charCode == 186)
			char = ";";
		else if (charCode == 187)
			char = "=";
		else if (charCode == 188)
			char = ",";
		else if (charCode == 189)
			char = "-";
		else if (charCode == 190)
			char = ".";
		else if (charCode == 191)
			char = "/";
		else if (charCode == 192)
			char = "`";
		else if (charCode == 219)
			char = "[";
		else if (charCode == 220)
			char = "\\";
		else if (charCode == 221)
			char = "]";
		else if (charCode == 222)
			char = "'";
		else
			char = String.fromCharCode(charCode);
		return char;
	}
} ]);

angular.module('proxyService', [ 'ngResource' ])
.service('objectCache', [ '$q', '$timeout', function($q, $timeout) {
	// $resource does it's own caching, but still builds a new object
	// so need to do our own caching
	var cache = true; 
	var objCache = {}; // Don't know if this is a good idea since it'll prevent
	// GC, but we'll see I guess...

	this.getObj = function(key) {
		if (cache && objCache[key] != undefined) {
			return objCache[key].obj;
		} else {
			return null;
		}
	};

	this.setObj = function(key, obj) {
		if (cache) {
			objCache[key] = {
				obj : obj,
				info : {}
			};
		}
	};

	this.hasObj = function(key) {
		if (cache) {
			return objCache.hasOwnProperty(key);
		} else {
			return false;
		}
	};

	this.removeObj = function(key) {
		if (cache) {
			delete objCache[key];
		}
	}
} ])
.service('proxyObjectResolver', [ '$q', '$timeout', '$rootScope', 'objectCache', function($q, $timeout, $rootScope, objectCache) {
	var getObj = function(metaData, id) {
		if(id !== undefined) {
			var key = metaData.data.uri.replace(':id', id.toString());
			if (!objectCache.hasObj(key)) {
				var obj = metaData.resource.get({
					id : id
				}).$promise;
				obj.then(function(o) {
					objectCache.setObj(key, o);
				});
	
				return obj;
			}
	
			return objectCache.getObj(key);
		} else {
			return null;
		}
	}

	this.resolveProp = function(object, propName, callback) {
		if (object != undefined) {
			if (object[propName + '_metaData'] != undefined && object[propName + '_metaData'].resolved == false) {
				var metaData = object[propName + '_metaData'];
				var obj = object;
				var result;
				if (metaData.data.isList) {
					var objs = [];
					for (var index = 0; index < metaData.data.ids.length; index++) {
						var id = metaData.data.ids[index];
						objs.push(getObj(metaData, id));
					}

					result = $q.all(objs);
				} else {
					var id = metaData.data.ids[0];
					result = $q.when(getObj(metaData, id));
				}

				result.then(function(vars) {
					metaData.resolved = true;
					if(metaData.data.isList) {
						for (var index = 0; index < vars.length; index++) {
							obj[propName].push(vars[index]);
						}
					} else {					
						angular.extend(obj[propName], vars);
					}
					$rootScope.$$phase || $rootScope.$digest();
					if (callback != undefined) {
						callback(vars);
					}
				});
			} else {
				if (callback != undefined) {
					callback(object[propName]);
				}
			}
		}
	}
} ])
.factory('proxyResourceInterceptor', [ '$injector', '$q', 'proxyObjectResolver', 'objectCache', function($injector, $q, proxyObjectResolver, objectCache) {
	var modObject = function(respObj) {
		for ( var prop in respObj) {
			if (respObj[prop] != undefined && respObj[prop].hasOwnProperty('proxyObject') && $injector.has(respObj[prop].type)) {
				respObj[prop + '_metaData'] = {};
				respObj[prop + '_metaData']['data'] = respObj[prop];
				respObj[prop + '_metaData']['resolved'] = false;
				respObj[prop + '_metaData']['resource'] = $injector.get(respObj[prop].type);
				if(respObj[prop + '_metaData']['data'].isList) {
					respObj[prop] = [];
				} else {
					respObj[prop] = {};
				}
			}
		}
	};

	var unModObject = function(reqObj) {
		for ( var prop in reqObj) {
			if (reqObj[prop] != undefined ) {
				if (reqObj[prop + '_metaData'] != undefined) {
					if (!reqObj[prop + '_metaData']['resolved']) {
						reqObj[prop] = reqObj[prop + '_metaData']['data'];
					}
	
					delete reqObj[prop + '_metaData'];
				} else if (angular.isArray(reqObj[prop])) {
					for(var idx in reqObj[prop]) {
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
} ]);
