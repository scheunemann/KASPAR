(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'mousetrap', 
	                     'mousetrapPause', 
	                     'js/services/displayServices' 
	                     ];

	define(dependancies, function(angular, mousetrap, mousetrapPause, displayServices) {

		var HotkeyEditor = function(hotkeyFormatter) {
			return {
				templateUrl : 'partials/trigger/hotkey.html',
				restrict : 'E',
				scope : {
					hotkey : "=",
					button : "=",
				},
				controller : function($scope) {
					$scope.deleteKey = function() {
						$scope.button.hotKeys.splice(keys.indexOf($scope.hotkey), 1);
						if ($scope.hotkey.id != undefined) {
							$scope.hotkey.$delete();
						}
					}

					$scope.updateKey = function($event, hotKey) {
						var code = $event.which || $event.keyCode; // Not-IE ||
																	// IE
						var key = hotkeyFormatter.getDisplayFromEvent($event);
						if (key != "") {
							hotKey.keyString = key;
							$scope.hotkeyEditor.key.$dirty = true;
							$event.preventDefault();
						}
					};
				},
			};
		};

		return [ 'hotkeyFormatter', HotkeyEditor ];
	});
}());
