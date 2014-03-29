'use strict';

define([ 'angular' ], function(angular) {

	var Saveable = function($compile, $timeout) {
		return {
			restrict : 'A',
			require : [ 'ngModel', '^form', '^model' ],
			link : function(scope, element, attrs, controllers) {
				var name = controllers[1].$name + "." + controllers[0].$name;
				var updateCalled = false;
				var parentElement = angular.element(element[0].parentElement);
				var modelCtrl = controllers[0];
				var saveCtrl = controllers[2];

				scope.$watch(name + '.$dirty', function(value) {
					if (value) {
						parentElement.addClass('has-warning');
					} else {
						parentElement.removeClass('has-warning');
					}
				});

				scope.$watch(name + '.$valid', function(value) {
					if (modelCtrl.$dirty) {
						if (value) {
							parentElement.removeClass('has-error');
						} else {
							parentElement.addClass('has-error');
						}
					}
				});

				scope.$watch(name + '.$pristine', function(value) {
					if (!value) {
						parentElement.removeClass('has-success');
					} else if (updateCalled) {
						// uiMessages.transitionElement()
						parentElement.addClass('has-success');
						$timeout(function() {
							parentElement.removeClass('has-success');
						}, 2000)
						updateCalled = false;
					}
				});

				var callUpdate = function() {
					if (modelCtrl.$dirty && modelCtrl.$valid) {
						saveCtrl.updateObj(modelCtrl);
						updateCalled = true;
					}
				}

				element.on('blur', function() {
					callUpdate();
				});

				element.on('keyup', function($event) {
					var code = $event.which || $event.keyCode; // Not-IE ||
					// IE
					if (code == 13) { // enter key
						callUpdate();
					}
				});
			}
		}
	};

	return [ '$compile', '$timeout', Saveable ];
});
