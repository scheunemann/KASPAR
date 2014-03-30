'use strict';

define(function(require) {
	var angular = require('angular');
	require('mousetrap');
	require('mousetrapPause');
	require('common/services/displayServices');
	var template = require('text!./hotkeyEditor.tpl.html');

	var HotkeyEditor = function(hotkeyFormatter) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				hotkey : "=",
				button : "=",
			},
			controller : function($scope) {
				$scope.deleteKey = function() {
					$scope.button.hotKeys.splice($scope.button.hotKeys.indexOf($scope.hotkey), 1);
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
