'use strict';

/* Filters */

angular.module('kasparGUI.filters', [])
.filter('interpolate', [ 'version', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	}
} ])
.filter('intersect', function() {
	return function(inputList, inputProp, objList, objProp) {
		var ret = [];
		if (objList === undefined) { return ret; }
		if (Object.prototype.toString.call(objList) != '[object Array]') {
			objList = [ objList ];
		}

		for (var i = 0; i < inputList.length; i++) {
			for (var j = 0; j < objList.length; j++) {
				var eq = false;
				if (objProp == '' && inputProp == '') {
					eq = objList[j] == inputList[i];
				} else if (objProp == '' && inputProp != '') {
					eq = objList[j] == inputList[i][inputProp];
				} else if (objProp != '' && inputProp == '') {
					eq = objList[j][objProp] == inputList[i];
				} else {
					eq = objList[j][objProp] == inputList[i][inputProp];
				}

				if (eq) {
					ret.push(inputList[i]);
					break;
				}
			}
		}

		return ret;
	};
})
.filter('except', function() {
	return function(inputList, objList, property) {
		var ret = [];
		if (objList === undefined) { return inputList; }
		property = typeof(property) !== 'undefined' ? property : 'id';

		if (Object.prototype.toString.call(objList) != '[object Array]') {
			objList = [ objList ];
		}

		for (var i = 0; i < inputList.length; i++) {
			var eq = false;
			for (var j = 0; j < objList.length; j++) {
				if (property == '') {
					eq = objList[j] == inputList[i];
				} else {
					eq = objList[j][property] == inputList[i][property];
				}

				if (eq) {
					break;
				}
			}
			
			if(!eq) {
				ret.push(inputList[i]);
			}
		}
		
//		for (var i = 0; i < inputList.length; i++) {
//			if (objList.indexOf(inputList[i]) == -1) {
//				ret.push(inputList[i]);
//			}
//		}

		return ret;
	};
});
