(function() {
	'use strict';

	var dependancies = [];

	define(dependancies, function() {
		var ExcpetFilter = function() {
			return function(inputList, objList, property) {
				var ret = [];
				if (objList === undefined) { return inputList; }
				property = typeof (property) !== 'undefined' ? property : 'id';

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

					if (!eq) {
						ret.push(inputList[i]);
					}
				}

				return ret;
			};
		};

		return ExcpetFilter;
	});
}());
