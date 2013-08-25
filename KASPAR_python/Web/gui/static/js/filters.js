'use strict';

/* Filters */

angular.module('kasparGUI.filters', []).filter('interpolate', [ 'version', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	}
} ]).filter('listFilter', function() {
	return function(inputList, inputProp, objList, objProp) {
		var ret = [];
		for ( var i = 0; i < inputList.length; i++) {
			for ( var j = 0; j < objList.length; j++) {
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
});
