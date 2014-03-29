'use strict';

define(function(require) {
	var angular = require(angular);

	var SensorValueEditor = function($compile) {
		return {
			templateUrl : 'partials/trigger/sensorValueEditor.html',
			restrict : 'E',
			scope : {
				type : "=",
				sensor : "=",
				value : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
				scope.basicopen = true;
				scope.advancedopen = false;
				// scope.$watch('type', function(newType) {
				// if (newType != "" && newType != undefined) {
				// if (newType.toLowerCase() == "group" ||
				// newType.toLowerCase()
				// == "sequence") {
				// iElement.html('<' + newType + '-editor action="action"
				// actions="actions"></' + newType + '-editor>');
				// } else {
				// iElement.html('<' + newType + '-editor
				// action="action"></' +
				// newType + '-editor>');
				// }
				// $compile(iElement.contents())(scope);
				// } else {
				// iElement.html('');
				// $compile(iElement.contents())(scope);
				// }
				// });
			},
		};
	};

	return [ '$compile', SensorValueEditor ];
});
